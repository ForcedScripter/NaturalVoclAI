"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────

export type AgentStatus =
    | "idle"
    | "connecting"
    | "listening"
    | "thinking"
    | "speaking"
    | "error";

export interface VoiceAgentOptions {
    /** WebSocket base URL — e.g. ws://localhost:8805/ws */
    wsUrl: string;
    /** Language code sent as ?lang= query param */
    language?: string;
    /** Unique session ID for dynamic RAG mapping */
    sessionId?: string;
    /** Called on every user transcription from server */
    onTranscription?: (text: string) => void;
    /** Called when the bot starts speaking */
    onBotStartedSpeaking?: () => void;
    /** Called when the bot stops speaking */
    onBotStoppedSpeaking?: () => void;
    /** Called on error */
    onError?: (message: string) => void;
}

export interface VoiceAgentState {
    status: AgentStatus;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

/** Convert Float32 audio samples → PCM16 LE ArrayBuffer for WebSocket transport. */
function float32ToPCM16(float32: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
}

// ──────────────────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────────────────

/**
 * React hook that manages a real-time bidirectional voice connection
 * to the Pipecat FastAPI backend via WebSocket.
 *
 * Audio flow:
 *   Mic → AudioWorklet (Float32) → PCM16 → WebSocket → Server
 *   Server → WebSocket (PCM16 binary) → Float32 → AudioContext playback
 *
 * Control flow:
 *   Server → WebSocket (JSON RTVI messages) → state updates
 *
 * Key design decisions (ported from working client/agent.js):
 *   - Separate AudioContexts for capture (16kHz) and playback (16kHz)
 *   - Worklet connected to destination (required by some browsers)
 *   - Mic health check (5s timeout if no frames sent)
 *   - Race-safe disconnect (flag before cleanup)
 */
export function useVoiceAgent(options: VoiceAgentOptions): VoiceAgentState {
    const { wsUrl, language = "hi-IN", sessionId, onTranscription, onBotStartedSpeaking, onBotStoppedSpeaking, onError } = options;

    const [status, setStatus] = useState<AgentStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    // Refs for mutable state that shouldn't trigger re-renders
    const wsRef = useRef<WebSocket | null>(null);
    const captureContextRef = useRef<AudioContext | null>(null);   // FIX #1: Separate capture context
    const playbackContextRef = useRef<AudioContext | null>(null);  // FIX #1: Separate playback context
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const playQueueRef = useRef<ArrayBuffer[]>([]);
    const isPlayingRef = useRef(false);
    const isConnectedRef = useRef(false);
    const isCleaningUpRef = useRef(false);        // FIX #4: Guard against double-cleanup
    const frameCountRef = useRef(0);
    const micHealthTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);  // FIX #3
    const lastServerErrorRef = useRef<string | null>(null);

    // Keep callback refs current without re-creating the hook
    const onTranscriptionRef = useRef(onTranscription);
    const onBotStartedSpeakingRef = useRef(onBotStartedSpeaking);
    const onBotStoppedSpeakingRef = useRef(onBotStoppedSpeaking);
    const onErrorRef = useRef(onError);

    useEffect(() => { onTranscriptionRef.current = onTranscription; }, [onTranscription]);
    useEffect(() => { onBotStartedSpeakingRef.current = onBotStartedSpeaking; }, [onBotStartedSpeaking]);
    useEffect(() => { onBotStoppedSpeakingRef.current = onBotStoppedSpeaking; }, [onBotStoppedSpeaking]);
    useEffect(() => { onErrorRef.current = onError; }, [onError]);

    // ── Audio Playback (server → speaker) ──────────────────
    // Uses the dedicated playback AudioContext

    const playNext = useCallback(async () => {
        const ctx = playbackContextRef.current;
        if (!ctx || playQueueRef.current.length === 0) {
            isPlayingRef.current = false;
            return;
        }
        isPlayingRef.current = true;
        const buf = playQueueRef.current.shift()!;
        try {
            const pcm16 = new Int16Array(buf);
            const float32 = new Float32Array(pcm16.length);
            for (let i = 0; i < pcm16.length; i++) {
                float32[i] = pcm16[i] / 32768;
            }
            const audioBuffer = ctx.createBuffer(1, float32.length, 16000);
            audioBuffer.getChannelData(0).set(float32);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.onended = () => playNext();
            source.start();
        } catch (err) {
            console.error("[useVoiceAgent] playback error:", err);
            playNext(); // skip broken frame
        }
    }, []);

    const enqueueAudio = useCallback((arrayBuffer: ArrayBuffer) => {
        playQueueRef.current.push(arrayBuffer);
        if (!isPlayingRef.current) playNext();
    }, [playNext]);

    /** Flush the playback queue — used on barge-in (user starts speaking). */
    const flushPlaybackQueue = useCallback(() => {
        playQueueRef.current = [];
        isPlayingRef.current = false;
    }, []);

    // ── WebSocket Message Handler ──────────────────────────

    const handleMessage = useCallback(async (event: MessageEvent) => {
        // Binary = audio from server
        if (event.data instanceof Blob) {
            const buf = await event.data.arrayBuffer();
            enqueueAudio(buf);
            return;
        }
        if (event.data instanceof ArrayBuffer) {
            enqueueAudio(event.data);
            return;
        }

        // Text = RTVI JSON control message
        try {
            const msg = JSON.parse(event.data);
            const type = msg.type || "";

            switch (type) {
                case "bot-ready":
                    console.log("[useVoiceAgent] bot ready");
                    break;

                case "bot-started-speaking":
                    setStatus("speaking");
                    onBotStartedSpeakingRef.current?.();
                    break;

                case "bot-stopped-speaking":
                    if (isConnectedRef.current) setStatus("listening");
                    onBotStoppedSpeakingRef.current?.();
                    break;

                case "user-started-speaking":
                    // Barge-in: flush queued bot audio when user speaks
                    flushPlaybackQueue();
                    if (isConnectedRef.current) setStatus("listening");
                    break;

                case "user-transcription": {
                    const text = msg.data?.text || msg.text || "";
                    if (text) onTranscriptionRef.current?.(text);
                    break;
                }

                case "bot-llm-started":
                    setStatus("thinking");
                    break;

                case "error":
                case "error-response": {
                    const errMsg = msg.data?.message || "Server error";
                    console.error("[useVoiceAgent] server error:", errMsg);
                    lastServerErrorRef.current = errMsg;
                    setError(errMsg);
                    setStatus("error");
                    onErrorRef.current?.(errMsg);
                    break;
                }

                default:
                    // Unhandled RTVI types — ignore silently
                    break;
            }
        } catch (e) {
            console.warn("[useVoiceAgent] failed to parse JSON:", e);
        }
    }, [enqueueAudio, flushPlaybackQueue]);

    // ── Cleanup ────────────────────────────────────────────
    // FIX #4: Guard against double-cleanup with isCleaningUpRef

    const cleanup = useCallback(() => {
        if (isCleaningUpRef.current) return;
        isCleaningUpRef.current = true;

        isConnectedRef.current = false;
        frameCountRef.current = 0;
        playQueueRef.current = [];
        isPlayingRef.current = false;

        // FIX #3: Clear mic health timer
        if (micHealthTimerRef.current) {
            clearTimeout(micHealthTimerRef.current);
            micHealthTimerRef.current = null;
        }

        // Disconnect worklet first
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect();
            workletNodeRef.current = null;
        }

        // FIX #1: Close both AudioContexts
        if (captureContextRef.current) {
            captureContextRef.current.close().catch(() => { });
            captureContextRef.current = null;
        }
        if (playbackContextRef.current) {
            playbackContextRef.current.close().catch(() => { });
            playbackContextRef.current = null;
        }

        // Stop mic tracks
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;
        }

        // Close WebSocket LAST (so onclose handler sees cleanup already done)
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        isCleaningUpRef.current = false;
        console.log("[useVoiceAgent] cleanup complete");
    }, []);

    // ── Connect ────────────────────────────────────────────

    const connect = useCallback(async () => {
        if (isConnectedRef.current) return;

        setError(null);
        setStatus("connecting");

        try {
            // 1. Get mic access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            mediaStreamRef.current = stream;

            // 2. Open WebSocket
            const url = sessionId 
                ? `${wsUrl}?session_id=${sessionId}&lang=${language}`
                : `${wsUrl}?lang=${language}`;
            const ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";
            wsRef.current = ws;

            await new Promise<void>((resolve, reject) => {
                ws.onopen = () => resolve();
                ws.onerror = () => reject(new Error("WebSocket connection failed"));
                // Timeout after 10s
                setTimeout(() => reject(new Error("Connection timeout")), 10000);
            });

            isConnectedRef.current = true;

            // 3. FIX #1: Create SEPARATE AudioContexts for capture and playback
            const captureCtx = new AudioContext({ sampleRate: 16000 });
            captureContextRef.current = captureCtx;

            const playbackCtx = new AudioContext({ sampleRate: 16000 });
            playbackContextRef.current = playbackCtx;

            // Resume if suspended (browser autoplay policy)
            if (captureCtx.state === "suspended") await captureCtx.resume();
            if (playbackCtx.state === "suspended") await playbackCtx.resume();

            // 4. Load AudioWorklet for mic capture
            await captureCtx.audioWorklet.addModule("/audio-processor.worklet.js");

            const source = captureCtx.createMediaStreamSource(stream);
            const worklet = new AudioWorkletNode(captureCtx, "audio-capture");
            workletNodeRef.current = worklet;

            worklet.port.onmessage = (event: MessageEvent) => {
                if (!isConnectedRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
                const pcm16 = float32ToPCM16(event.data as Float32Array);
                wsRef.current.send(pcm16);
                frameCountRef.current++;
                if (frameCountRef.current === 1) {
                    console.log("[useVoiceAgent] first audio frame sent");
                }
                if (frameCountRef.current % 100 === 0) {
                    console.log("[useVoiceAgent] audio frames sent:", frameCountRef.current);
                }
            };

            source.connect(worklet);
            // FIX #2: Connect worklet to destination — required by some browsers to process audio
            worklet.connect(captureCtx.destination);

            // 5. FIX #3: Start mic health check (from working client/agent.js)
            frameCountRef.current = 0;
            micHealthTimerRef.current = setTimeout(() => {
                if (!isConnectedRef.current) return;
                if (frameCountRef.current === 0) {
                    console.error("[useVoiceAgent] mic health check FAILED — no audio frames sent");
                    setError("No microphone audio detected. Please check your mic permissions.");
                    onErrorRef.current?.("No microphone audio detected");
                } else {
                    console.log("[useVoiceAgent] mic health check OK, frames sent:", frameCountRef.current);
                }
            }, 5000);

            // 6. Wire up message/close handlers
            ws.onmessage = handleMessage;

            ws.onclose = (ev) => {
                console.log("[useVoiceAgent] WebSocket closed, code:", ev.code, ev.reason);
                if (isCleaningUpRef.current) return; // Already cleaning up from disconnect()

                const serverErr = lastServerErrorRef.current;
                cleanup();
                if (serverErr) {
                    setError(serverErr);
                    setStatus("error");
                    lastServerErrorRef.current = null;
                } else if (ev.code !== 1000 && ev.code !== 1005) {
                    const reason = ev.reason || `Connection lost (code ${ev.code})`;
                    setError(reason);
                    setStatus("error");
                } else {
                    setStatus("idle");
                }
            };

            ws.onerror = () => {
                const msg = "WebSocket error";
                setError(msg);
                setStatus("error");
                onErrorRef.current?.(msg);
            };

            setStatus("listening");
            console.log("[useVoiceAgent] connected and streaming");

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Connection failed";
            console.error("[useVoiceAgent] connect failed:", msg);
            setError(msg);
            setStatus("error");
            onErrorRef.current?.(msg);
            cleanup();
        }
    }, [wsUrl, language, handleMessage, cleanup]);

    // ── Disconnect ─────────────────────────────────────────
    // FIX #4: Set isConnected = false FIRST to prevent onclose double-fire

    const disconnect = useCallback(() => {
        isConnectedRef.current = false;  // Signal first
        cleanup();
        setStatus("idle");
        setError(null);
    }, [cleanup]);

    // ── Cleanup on unmount ─────────────────────────────────

    useEffect(() => {
        return () => {
            isConnectedRef.current = false;
            cleanup();
        };
    }, [cleanup]);

    return { status, error, connect, disconnect };
}

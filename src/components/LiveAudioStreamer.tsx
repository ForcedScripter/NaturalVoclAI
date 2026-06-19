"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Mic, Square, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceAgent, type AgentStatus } from "@/hooks/useVoiceAgent";

// ─── Voice Model Lists ────────────────────────────────────

const MALE_VOICES = ["Shubh", "Aditya", "Rahul", "Rohan", "Amit", "Dev", "Ratan", "Varun", "Manan", "Sumit", "Kabir"];
const FEMALE_VOICES = ["Kavya", "Ritu", "Priya", "Neha", "Pooja", "Simran", "Ishita", "Shreya", "Roopa", "Amelia", "Sophia"];

// Map hook status → display state for the UI
type DisplayState = "idle" | "connecting" | "listening" | "processing" | "speaking";
function toDisplayState(status: AgentStatus): DisplayState {
    switch (status) {
        case "idle": return "idle";
        case "connecting": return "connecting";
        case "listening": return "listening";
        case "thinking": return "processing";
        case "speaking": return "speaking";
        case "error": return "idle";
        default: return "idle";
    }
}

// ─── Conversation Types ───────────────────────────────────

interface ConversationEntry {
    role: "user" | "agent";
    text: string;
    timestamp: number;
}

// ─── Component ────────────────────────────────────────────

export default function LiveAudioStreamer() {
    // Unique session ID for RAG mapping
    const [sessionId, setSessionId] = useState<string>("");

    useEffect(() => {
        setSessionId(crypto.randomUUID());
    }, []);

    // Voice selection
    const [selectedGender, setSelectedGender] = useState<"male" | "female">("female");
    const [selectedVoice, setSelectedVoice] = useState("Kavya");
    const [voicePanelOpen, setVoicePanelOpen] = useState(false);

    // Conversation log
    const [conversation, setConversation] = useState<ConversationEntry[]>([]);

    // Ref to auto-scroll transcript container
    const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    // Waveform animation
    const [waveformHeights, setWaveformHeights] = useState<number[]>(Array(12).fill(10));
    const animFrameRef = useRef<number | null>(null);


    const voices = selectedGender === "male" ? MALE_VOICES : FEMALE_VOICES;

    // ── WebSocket URL from env ────────────────────────────
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8805/ws";

    // ── Transcript handler ────────────────────────────────
    const handleTranscription = useCallback((text: string) => {
        setConversation((prev) => [
            ...prev,
            { role: "user", text, timestamp: Date.now() },
        ]);
    }, []);

    const handleBotStarted = useCallback(() => {
        // Bot started speaking — could track response timing here
    }, []);

    const handleBotStopped = useCallback(() => {
        // Bot finished speaking
    }, []);

    const handleError = useCallback((message: string) => {
        console.error("[LiveAudioStreamer] error:", message);
    }, []);

    // ── Voice Agent Hook ──────────────────────────────────
    const { status, error, connect, disconnect } = useVoiceAgent({
        wsUrl,
        language: "en-IN", // English default
        sessionId,
        onTranscription: handleTranscription,
        onBotStartedSpeaking: handleBotStarted,
        onBotStoppedSpeaking: handleBotStopped,
        onError: handleError,
    });

    const displayState = toDisplayState(status);

    // Connection timeout — if stuck in 'connecting' for 15s, auto-disconnect
    useEffect(() => {
        if (displayState !== "connecting") return;
        const timer = setTimeout(() => {
            disconnect();
        }, 15000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayState, disconnect]);

    // ── Waveform Animation ────────────────────────────────
    // Animate waveform bars based on agent state
    useEffect(() => {
        if (displayState === "idle" || displayState === "connecting") {
            setWaveformHeights(Array(12).fill(10));
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
            return;
        }

        let frame = 0;
        const animate = () => {
            frame++;
            const heights = Array.from({ length: 12 }, (_, i) => {
                if (displayState === "listening") {
                    // Subtle breathing animation while listening
                    return 6 + Math.sin(frame * 0.06 + i * 0.5) * 12 + Math.random() * 8;
                } else if (displayState === "speaking") {
                    // More energetic bars while bot speaks
                    return 8 + Math.sin(frame * 0.1 + i * 0.7) * 20 + Math.random() * 15;
                } else {
                    // Processing — gentle pulse
                    return 8 + Math.sin(frame * 0.04 + i * 0.3) * 6;
                }
            });
            setWaveformHeights(heights);
            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
        };
    }, [displayState]);

    // ── Toggle Connection ─────────────────────────────────
    const toggleStream = async () => {
        if (displayState !== "idle") {
            disconnect();
            setConversation([]);
            return;
        }
        // Clear any previous errors when retrying
        await connect();
    };

    // ── Cleanup on unmount ────────────────────────────────
    useEffect(() => {
        return () => {
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Expose user_id for DocumentUploader (backwards compatibility)
    useEffect(() => {
        if (typeof window !== "undefined" && sessionId) {
            (window as unknown as Record<string, string>).__aura_user_id = sessionId;
        }
    }, [sessionId]);

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#FFF5DC]/60 border border-[#C8923C]/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">

            <motion.div
                animate={{ opacity: displayState !== "idle" ? 0.3 : 0.1, scale: displayState === "listening" || displayState === "speaking" ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: displayState === "listening" || displayState === "speaking" ? Infinity : 0 }}
                className="absolute w-96 h-96 bg-[#C8923C]/20 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="z-10 flex flex-col items-center w-full">
                <h3 className="text-2xl text-[#3D2E1A] tracking-[0.2em] font-light mb-2 text-center">T E S T<br />T H E &nbsp; A G E N T</h3>

                <div className="h-8 mb-4">
                    {displayState === "idle" && <p className="text-[#8B7355] text-sm tracking-widest text-center">SELECT VOICE & TAP TO START</p>}
                    {displayState === "connecting" && <p className="text-[#C8923C] text-sm tracking-widest text-center flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> SECURING NEURAL LINK...</p>}
                    {displayState === "listening" && <p className="text-green-600 text-sm tracking-widest text-center animate-pulse">LISTENING TO YOUR VOICE</p>}
                    {displayState === "processing" && <p className="text-[#C8923C] text-sm tracking-widest text-center animate-pulse">PROCESSING CONTEXT...</p>}
                    {displayState === "speaking" && <p className="text-blue-600 text-sm tracking-widest text-center animate-pulse">AGENT RESPONDING</p>}
                </div>

                {/* Voice Model Picker */}
                <div className="mb-6 w-full max-w-xs">
                    {/* Gender toggle */}
                    <div className="flex bg-[#C8923C]/[0.05] rounded-lg p-0.5 border border-[#C8923C]/10 mb-3">
                        {(["female", "male"] as const).map((g) => (
                            <button
                                key={g}
                                onClick={() => {
                                    setSelectedGender(g);
                                    setSelectedVoice(g === "male" ? MALE_VOICES[0] : FEMALE_VOICES[0]);
                                    setVoicePanelOpen(true);
                                }}
                                disabled={displayState !== "idle"}
                                className={`flex-1 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-md transition-all duration-300 ${selectedGender === g
                                    ? "bg-[#C8923C]/15 text-[#C8923C] border border-[#C8923C]/30"
                                    : "text-[#8B7355] hover:text-[#3D2E1A]"
                                    } ${displayState !== "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>

                    {/* Voice selector toggle */}
                    <button
                        onClick={() => setVoicePanelOpen(!voicePanelOpen)}
                        disabled={displayState !== "idle"}
                        className={`w-full flex items-center justify-between px-3 py-2 bg-[#C8923C]/[0.05] border border-[#C8923C]/10 rounded-lg text-xs tracking-[0.15em] text-[#3D2E1A] hover:border-[#C8923C]/30 transition-all duration-300 ${displayState !== "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#C8923C] animate-pulse" />
                            {selectedVoice.toUpperCase()}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${voicePanelOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Voice scroll list */}
                    <AnimatePresence>
                        {voicePanelOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-2 max-h-[120px] overflow-y-auto rounded-lg border border-[#C8923C]/10 bg-[#FFFDF5]">
                                    {voices.map((voice) => (
                                        <button
                                            key={voice}
                                            onClick={() => { setSelectedVoice(voice); setVoicePanelOpen(false); }}
                                            className={`w-full text-left px-3 py-2 text-[11px] tracking-[0.15em] border-b border-[#C8923C]/[0.06] last:border-b-0 transition-all duration-200 ${selectedVoice === voice
                                                ? "text-[#C8923C] bg-[#C8923C]/10"
                                                : "text-[#8B7355] hover:text-[#3D2E1A] hover:bg-[#C8923C]/[0.04]"
                                                }`}
                                        >
                                            {voice.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Error display */}
                <AnimatePresence>
                    {error && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs tracking-wider mb-4 text-center">
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Microphone Button */}
                <motion.button
                    onClick={toggleStream}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center justify-center w-28 h-28 rounded-full border-2 transition-all duration-300
                        ${displayState !== "idle"
                            ? "border-[#C8923C] bg-[#C8923C]/10 text-[#C8923C]"
                            : "border-[#C8923C]/20 bg-[#FFFDF5] text-[#3D2E1A] hover:border-[#C8923C]/50"}`}
                >
                    {displayState !== "idle" && (
                        <>
                            <motion.div className="absolute inset-0 rounded-full border border-[#C8923C]/50" animate={{ scale: [1, 1.5], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            <motion.div className="absolute inset-0 rounded-full border border-[#C8923C]/30" animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                        </>
                    )}
                    {displayState !== "idle" ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
                </motion.button>

                {/* Waveform */}
                <div className="mt-6 h-12 w-full max-w-[180px] flex items-end justify-between gap-1">
                    {waveformHeights.map((height, i) => (
                        <motion.div
                            key={i}
                            className={`w-full rounded-t-sm ${displayState !== "idle" ? "bg-[#C8923C]" : "bg-[#C8923C]/15"}`}
                            animate={{ height: `${Math.max(4, height)}px` }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                    ))}
                </div>

                {/* Live Conversation Transcript */}
                <div 
                    ref={transcriptContainerRef}
                    className="mt-6 w-full max-w-md max-h-36 overflow-y-auto pr-1 space-y-3 scrollbar-thin"
                    style={{ scrollBehavior: "smooth" }}
                >

                    <AnimatePresence initial={false}>
                        {conversation.slice(-6).map((entry, i, arr) => {
                            const isLatest = i === arr.length - 1;
                            return (
                                <motion.div
                                    key={entry.timestamp} layout
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: isLatest ? 1 : 0.5, y: 0, scale: isLatest ? 1 : 0.97 }}
                                    transition={{ layout: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 }, y: { type: "spring", stiffness: 400, damping: 25 }, scale: { duration: 0.3 } }}
                                >
                                    <motion.div className={`rounded-xl px-4 py-3 border transition-all duration-300 ${entry.role === "user"
                                        ? isLatest ? "bg-[#3D2E1A]/5 border-[#3D2E1A]/10" : "bg-[#3D2E1A]/[0.02] border-[#3D2E1A]/[0.03]"
                                        : isLatest ? "bg-[#C8923C]/10 border-[#C8923C]/25" : "bg-[#C8923C]/5 border-[#C8923C]/10"
                                        }`}>
                                        <p className={`text-[10px] tracking-widest mb-1 ${entry.role === "user" ? "text-[#8B7355]" : isLatest ? "text-[#C8923C]" : "text-[#C8923C]/50"}`}>
                                            {entry.role === "user" ? "YOU" : "AGENT"}
                                        </p>
                                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${isLatest ? "text-[#3D2E1A]" : "text-[#8B7355]"}`}>
                                            {entry.text}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Connection status indicator */}
                {displayState !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] tracking-[0.2em] text-[#B8A080]">REALTIME WEBSOCKET ACTIVE</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

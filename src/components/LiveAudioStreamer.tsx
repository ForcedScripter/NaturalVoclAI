"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AgentState = "idle" | "connecting" | "listening" | "processing" | "speaking";

interface ConversationEntry {
    transcript: string;
    response: string;
}

const MALE_VOICES = ["Shubh", "Aditya", "Rahul", "Rohan", "Amit", "Dev", "Ratan", "Varun", "Manan", "Sumit", "Kabir"];
const FEMALE_VOICES = ["Kavya", "Ritu", "Priya", "Neha", "Pooja", "Simran", "Ishita", "Shreya", "Roopa", "Amelia", "Sophia"];

export default function LiveAudioStreamer() {
    const [agentState, setAgentState] = useState<AgentState>("idle");
    const [conversation, setConversation] = useState<ConversationEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [waveformHeights, setWaveformHeights] = useState<number[]>(Array(12).fill(10));

    // Voice selection
    const [selectedGender, setSelectedGender] = useState<"male" | "female">("female");
    const [selectedVoice, setSelectedVoice] = useState("Kavya");
    const [voicePanelOpen, setVoicePanelOpen] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const isRecordingRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const userIdRef = useRef<string>(crypto.randomUUID());
    const selectedVoiceRef = useRef(selectedVoice);

    const voices = selectedGender === "male" ? MALE_VOICES : FEMALE_VOICES;

    // Keep voice ref in sync
    useEffect(() => {
        selectedVoiceRef.current = selectedVoice;
    }, [selectedVoice]);

    // Send voice selection to backend when it changes
    useEffect(() => {
        fetch("/api/set-voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voice: selectedVoice, user_id: userIdRef.current }),
        }).catch(() => { });
    }, [selectedVoice]);

    // Cleanup session on unmount
    useEffect(() => {
        return () => {
            stopEverything();
            fetch("/api/end-session", {
                method: "POST",
                body: new URLSearchParams({ user_id: userIdRef.current }),
            }).catch(() => { });
        };
    }, []);

    const stopEverything = () => {
        isRecordingRef.current = false;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
        if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
        if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
        if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        analyserRef.current = null;
        mediaRecorderRef.current = null;
        setWaveformHeights(Array(12).fill(10));
    };

    const animateWaveform = useCallback(() => {
        const analyser = analyserRef.current;
        if (!analyser) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const step = Math.floor(dataArray.length / 12);
        const heights = Array.from({ length: 12 }, (_, i) => 4 + ((dataArray[i * step] || 0) / 255) * 50);
        setWaveformHeights(heights);
        animFrameRef.current = requestAnimationFrame(animateWaveform);
    }, []);

    const recordAndSend = useCallback(async () => {
        if (!streamRef.current || !isRecordingRef.current) return;
        return new Promise<void>((resolve) => {
            const chunks: Blob[] = [];
            const mr = new MediaRecorder(streamRef.current!, { mimeType: "audio/webm" });
            mediaRecorderRef.current = mr;
            mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            mr.onstop = async () => {
                if (chunks.length === 0 || !isRecordingRef.current) { resolve(); return; }
                setAgentState("processing");
                try {
                    const blob = new Blob(chunks, { type: "audio/webm" });
                    const formData = new FormData();
                    formData.append("audio", blob, "recording.webm");
                    formData.append("user_id", userIdRef.current);
                    formData.append("voice", selectedVoiceRef.current);
                    const res = await fetch("/api/voice-chat", { method: "POST", body: formData });
                    if (!res.ok) throw new Error(`Server error: ${res.status}`);
                    const data = await res.json();
                    if (data.transcript && data.transcript.trim()) {
                        if (data.user_id) userIdRef.current = data.user_id;
                        setConversation((prev) => [...prev, { transcript: data.transcript, response: data.response }]);
                        if (data.audio) { setAgentState("speaking"); await playBase64Audio(data.audio); }
                    }
                } catch (err) {
                    console.error("Voice chat error:", err);
                    setError("Failed to process audio. Is the backend running?");
                }
                if (isRecordingRef.current) setAgentState("listening");
                resolve();
            };
            mr.start();
            setTimeout(() => { if (mr.state === "recording") mr.stop(); }, 3000);
        });
    }, []);

    const playBase64Audio = (base64: string): Promise<void> => {
        return new Promise((resolve) => {
            const audioData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
            const blob = new Blob([audioData], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
            audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
            audio.play().catch(() => resolve());
        });
    };

    const startLoop = useCallback(async () => {
        isRecordingRef.current = true;
        while (isRecordingRef.current) await recordAndSend();
    }, [recordAndSend]);

    const toggleStream = async () => {
        if (agentState !== "idle") { stopEverything(); setAgentState("idle"); return; }
        setError(null);
        setAgentState("connecting");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true } });
            streamRef.current = stream;
            const ctx = new AudioContext();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;
            setAgentState("listening");
            animateWaveform();
            startLoop();
        } catch (err) {
            console.error("Mic error:", err);
            setError("Microphone access denied.");
            setAgentState("idle");
        }
    };

    // Expose user_id for DocumentUploader
    if (typeof window !== "undefined") {
        (window as unknown as Record<string, string>).__aura_user_id = userIdRef.current;
    }

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">

            <motion.div
                animate={{ opacity: agentState !== "idle" ? 0.4 : 0.1, scale: agentState === "listening" || agentState === "speaking" ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: agentState === "listening" || agentState === "speaking" ? Infinity : 0 }}
                className="absolute w-96 h-96 bg-brand-purple/30 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="z-10 flex flex-col items-center w-full">
                <h3 className="text-2xl text-white tracking-[0.2em] font-light mb-2 text-center">T E S T<br />T H E &nbsp; A G E N T</h3>

                <div className="h-8 mb-4">
                    {agentState === "idle" && <p className="text-zinc-500 text-sm tracking-widest text-center">SELECT VOICE & TAP TO START</p>}
                    {agentState === "connecting" && <p className="text-brand-purple text-sm tracking-widest text-center flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> SECURING NEURAL LINK...</p>}
                    {agentState === "listening" && <p className="text-green-400 text-sm tracking-widest text-center animate-pulse">LISTENING TO YOUR VOICE</p>}
                    {agentState === "processing" && <p className="text-yellow-400 text-sm tracking-widest text-center animate-pulse">PROCESSING CONTEXT...</p>}
                    {agentState === "speaking" && <p className="text-blue-400 text-sm tracking-widest text-center animate-pulse">AGENT RESPONDING</p>}
                </div>

                {/* Voice Model Picker */}
                <div className="mb-6 w-full max-w-xs">
                    {/* Gender toggle */}
                    <div className="flex bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.06] mb-3">
                        {(["female", "male"] as const).map((g) => (
                            <button
                                key={g}
                                onClick={() => {
                                    setSelectedGender(g);
                                    setSelectedVoice(g === "male" ? MALE_VOICES[0] : FEMALE_VOICES[0]);
                                    setVoicePanelOpen(true);
                                }}
                                className={`flex-1 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-md transition-all duration-300 ${selectedGender === g
                                    ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/30"
                                    : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>

                    {/* Voice selector toggle */}
                    <button
                        onClick={() => setVoicePanelOpen(!voicePanelOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs tracking-[0.15em] text-zinc-300 hover:border-brand-purple/30 transition-all duration-300"
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
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
                                <div className="mt-2 max-h-[120px] overflow-y-auto rounded-lg border border-white/[0.06] bg-[#0a0a0a] scrollbar-thin scrollbar-thumb-brand-purple/30 scrollbar-track-transparent">
                                    {voices.map((voice) => (
                                        <button
                                            key={voice}
                                            onClick={() => { setSelectedVoice(voice); setVoicePanelOpen(false); }}
                                            className={`w-full text-left px-3 py-2 text-[11px] tracking-[0.15em] border-b border-white/[0.03] last:border-b-0 transition-all duration-200 ${selectedVoice === voice
                                                ? "text-brand-purple bg-brand-purple/10"
                                                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
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
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs tracking-wider mb-4 text-center">
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
                        ${agentState !== "idle"
                            ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                            : "border-white/20 bg-black text-white hover:border-brand-purple/50"}`}
                >
                    {agentState !== "idle" && (
                        <>
                            <motion.div className="absolute inset-0 rounded-full border border-brand-purple/50" animate={{ scale: [1, 1.5], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            <motion.div className="absolute inset-0 rounded-full border border-brand-purple/30" animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                        </>
                    )}
                    {agentState !== "idle" ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
                </motion.button>

                {/* Waveform */}
                <div className="mt-6 h-12 w-full max-w-[180px] flex items-end justify-between gap-1">
                    {waveformHeights.map((height, i) => (
                        <motion.div
                            key={i}
                            className={`w-full rounded-t-sm ${agentState !== "idle" ? "bg-brand-purple" : "bg-white/10"}`}
                            animate={{ height: `${Math.max(4, height)}px` }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                    ))}
                </div>

                {/* Conversation */}
                <div className="mt-6 w-full max-w-md space-y-3">
                    <AnimatePresence initial={false}>
                        {conversation.map((entry, i) => {
                            const isLatest = i === conversation.length - 1;
                            return (
                                <motion.div
                                    key={i} layout
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: isLatest ? 1 : 0.5, y: 0, scale: isLatest ? 1 : 0.97 }}
                                    transition={{ layout: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 }, y: { type: "spring", stiffness: 400, damping: 25 }, scale: { duration: 0.3 } }}
                                    className="space-y-2"
                                >
                                    <motion.div className={`rounded-xl px-4 py-3 border transition-all duration-300 ${isLatest ? "bg-white/10 border-white/10" : "bg-white/[0.03] border-white/[0.03]"}`}>
                                        <p className="text-[10px] text-zinc-500 tracking-widest mb-1">YOU</p>
                                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${isLatest ? "text-white" : "text-zinc-500"}`}>{entry.transcript}</p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.3 }}
                                        className={`rounded-xl px-4 py-3 border transition-all duration-300 ${isLatest ? "bg-brand-purple/15 border-brand-purple/30" : "bg-brand-purple/5 border-brand-purple/10"}`}
                                    >
                                        <p className={`text-[10px] tracking-widest mb-1 transition-colors duration-300 ${isLatest ? "text-brand-purple" : "text-brand-purple/50"}`}>AGENT</p>
                                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${isLatest ? "text-white" : "text-zinc-500"}`}>{entry.response}</p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

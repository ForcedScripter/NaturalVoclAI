"use client";

import { useState, useRef } from "react";
import {
    UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle,
    Database, ShoppingCart, Car, Bot, ChevronRight, Sparkles, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UploadState = "idle" | "uploading" | "success" | "error";

interface PretrainedCollection {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    details: string;
}

const pretrainedCollections: PretrainedCollection[] = [
    {
        id: "ecommerce",
        name: "E-Commerce",
        icon: <ShoppingCart className="w-4 h-4" />,
        description: "Sample products ready to query",
        details: "Pre-trained on e-commerce product catalog with existing sample products. Ask about electronics, pricing, return policies, and shipping. Ready to query out of the box.",
    },
    {
        id: "car_booking",
        name: "Mahindra Cars",
        icon: <Car className="w-4 h-4" />,
        description: "Mahindra vehicle specs & booking policies",
        details: "Pre-trained on Mahindra car PDFs — vehicle specifications, booking & cancellation policies, pricing details, and service information. Covers XUV, Thar, Scorpio, and more.",
    },
];

export default function DocumentUploader() {
    const [agentBuilderOpen, setAgentBuilderOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [uploadMsg, setUploadMsg] = useState("");
    const [activeCollection, setActiveCollection] = useState<string | null>(null);
    const [hoveredCollection, setHoveredCollection] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getSessionUserId = (): string => {
        if (typeof window !== "undefined") {
            return (window as unknown as Record<string, string>).__aura_user_id || "";
        }
        return "";
    };

    const selectPretrained = async (collection: PretrainedCollection) => {
        setActiveCollection(collection.id);
        const userId = getSessionUserId();
        try {
            await fetch("/api/set-collection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collection: collection.id, user_id: userId }),
            });
        } catch {
            // Silently fail — backend will fall back to default
        }
    };

    const uploadFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setUploadState("uploading");
        setUploadMsg("");

        const formData = new FormData();
        formData.append("file", selectedFile);

        const userId = getSessionUserId();
        if (userId) {
            formData.append("user_id", userId);
        }

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || data.error || "Upload failed");
            }

            setUploadState("success");
            setUploadMsg(`${data.chars?.toLocaleString() || "?"} characters extracted`);
            setActiveCollection("custom");
        } catch (err) {
            setUploadState("error");
            setUploadMsg(err instanceof Error ? err.message : "Upload failed");
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovered(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovered(true);
    };

    const handleDragLeave = () => setIsHovered(false);

    const reset = () => {
        setFile(null);
        setUploadState("idle");
        setUploadMsg("");
    };

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col justify-center relative overflow-hidden">

            {/* ── COLLAPSED STATE: "Build Your Agent" CTA ── */}
            <AnimatePresence mode="wait">
                {!agentBuilderOpen && (
                    <motion.div
                        key="cta"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center justify-center h-full"
                    >
                        {/* Animated bot icon */}
                        <motion.div
                            className="relative mb-8"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-600/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                                <Bot className="w-9 h-9 text-purple-400" />
                            </div>

                            {/* Orbiting sparkle */}
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-4 h-4 text-purple-400/60" />
                            </motion.div>

                            {/* Pulse rings */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl border border-purple-500/10"
                                animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>

                        <h3 className="text-2xl text-white tracking-[0.2em] font-light mb-2 text-center">
                            BUILD YOUR AGENT
                        </h3>
                        <p className="text-zinc-500 text-xs tracking-[0.15em] mb-8 text-center max-w-xs leading-relaxed">
                            FEED CONTEXT, CHOOSE A KNOWLEDGE BASE, AND LET YOUR AI SPEAK
                        </p>

                        {/* CTA Button */}
                        <motion.button
                            onClick={() => setAgentBuilderOpen(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600/15 to-violet-600/10 border border-purple-500/25 hover:border-purple-400/40 text-purple-300 hover:text-white transition-all duration-300"
                        >
                            <span className="text-xs tracking-[0.2em] font-medium">GET STARTED</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>

                        {/* Status badge if collection already active */}
                        {activeCollection && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/5 border border-green-500/15"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] tracking-[0.15em] text-green-400">
                                    AGENT ACTIVE — {activeCollection === "custom" ? "CUSTOM DOCS" : activeCollection.toUpperCase().replace("_", " ")}
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* ── EXPANDED STATE: Upload + Pre-trained ── */}
                {agentBuilderOpen && (
                    <motion.div
                        key="builder"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.15 }}
                        className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-brand-purple/15 rounded-full blur-[100px] pointer-events-none" />

                        {/* Header with close */}
                        <div className="flex items-center justify-between mb-5 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-600/10 border border-purple-500/15">
                                    <Bot className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm text-white tracking-[0.15em] font-medium">AGENT BUILDER</h3>
                                    <p className="text-[10px] text-zinc-600 tracking-wider">Feed your agent with knowledge</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAgentBuilderOpen(false)}
                                className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Upload area */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`relative w-full min-h-[140px] rounded-2xl border-2 border-dashed transition-all duration-500 ease-out flex flex-col items-center justify-center cursor-pointer group
                                ${isHovered ? "border-brand-purple bg-brand-purple/5" : "border-white/10 bg-white/[0.02] hover:border-brand-purple/50"}`}
                        >
                            <AnimatePresence mode="popLayout">
                                {uploadState === "idle" && !file && (
                                    <motion.div key="upload" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-3 text-zinc-400 group-hover:text-white transition-colors p-4">
                                        <UploadCloud className="w-8 h-8" />
                                        <div className="text-center">
                                            <p className="tracking-widest text-xs mb-1">Upload your documents</p>
                                            <p className="text-[10px] text-zinc-600 tracking-wider">PDF, TXT up to 10MB</p>
                                        </div>
                                    </motion.div>
                                )}

                                {uploadState === "uploading" && (
                                    <motion.div key="uploading" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-3 text-brand-purple p-4">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <p className="tracking-widest text-xs">INDEXING...</p>
                                        <p className="text-[10px] text-zinc-500 tracking-wider">{file?.name}</p>
                                    </motion.div>
                                )}

                                {uploadState === "success" && (
                                    <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-3 text-white p-4">
                                        <div className="relative">
                                            <FileText className="w-10 h-10 text-brand-purple" />
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="absolute -bottom-1 -right-1 bg-black rounded-full">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            </motion.div>
                                        </div>
                                        <div className="text-center">
                                            <p className="tracking-widest text-xs text-brand-purple">{file?.name}</p>
                                            <p className="text-[10px] text-green-400 tracking-wider mt-1">{uploadMsg}</p>
                                        </div>
                                        <button onClick={reset} className="text-[10px] text-zinc-500 hover:text-white tracking-widest transition-colors">UPLOAD ANOTHER</button>
                                    </motion.div>
                                )}

                                {uploadState === "error" && (
                                    <motion.div key="error" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-3 text-red-400 p-4">
                                        <AlertCircle className="w-8 h-8" />
                                        <div className="text-center">
                                            <p className="tracking-widest text-xs">UPLOAD FAILED</p>
                                            <p className="text-[10px] text-red-400/70 tracking-wider mt-1">{uploadMsg}</p>
                                        </div>
                                        <button onClick={reset} className="text-[10px] text-zinc-500 hover:text-white tracking-widest transition-colors">TRY AGAIN</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {uploadState === "idle" && (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.txt"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => { if (e.target.files && e.target.files[0]) uploadFile(e.target.files[0]); }}
                                />
                            )}
                        </div>

                        {/* Divider with "or" */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[10px] tracking-[0.2em] text-zinc-600">OR USE PRE-TRAINED</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        {/* Pre-trained collection selector */}
                        <div className="flex gap-3">
                            {pretrainedCollections.map((col) => (
                                <div key={col.id} className="relative flex-1"
                                    onMouseEnter={() => setHoveredCollection(col.id)}
                                    onMouseLeave={() => setHoveredCollection(null)}
                                >
                                    <motion.button
                                        onClick={() => selectPretrained(col)}
                                        whileTap={{ scale: 0.97 }}
                                        className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all duration-300 ${activeCollection === col.id
                                            ? "border-brand-purple/50 bg-brand-purple/10 text-brand-purple"
                                            : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-brand-purple/30 hover:text-white"
                                            }`}
                                    >
                                        <div className={`shrink-0 p-1.5 rounded-lg transition-colors duration-300 ${activeCollection === col.id ? "bg-brand-purple/20" : "bg-white/5"}`}>
                                            {col.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] tracking-[0.1em] font-medium truncate">{col.name.toUpperCase()}</p>
                                            <p className="text-[9px] tracking-wider text-zinc-600 truncate">{col.description}</p>
                                        </div>
                                    </motion.button>

                                    {/* Hover popup with metadata */}
                                    <AnimatePresence>
                                        {hoveredCollection === col.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 shadow-2xl shadow-black/50"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-1 rounded-md bg-brand-purple/15 text-brand-purple">{col.icon}</div>
                                                    <p className="text-[11px] tracking-[0.15em] text-white font-medium">{col.name.toUpperCase()}</p>
                                                </div>
                                                <p className="text-[10px] tracking-wider text-zinc-400 leading-relaxed">{col.details}</p>
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-[9px] tracking-widest text-green-500/70">READY</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

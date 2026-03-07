"use client";

import { motion } from "framer-motion";
import { Cpu, Globe, Mic, FileText, Zap, Shield } from "lucide-react";

const specs = [
    { icon: <Mic className="w-5 h-5" />, title: "Voice-First AI", desc: "Real-time speech-to-text with Sarvam AI for multilingual support." },
    { icon: <FileText className="w-5 h-5" />, title: "RAG Pipeline", desc: "Upload PDFs to build dynamic context. Retrieval-augmented answers." },
    { icon: <Cpu className="w-5 h-5" />, title: "GPT-4o Core", desc: "Powered by OpenAI's latest model with conversation memory." },
    { icon: <Globe className="w-5 h-5" />, title: "Multilingual", desc: "Understands and responds in Hindi, English, Tamil, and more." },
    { icon: <Zap className="w-5 h-5" />, title: "Low Latency", desc: "Sub-second STT + RAG + TTS pipeline for natural conversations." },
    { icon: <Shield className="w-5 h-5" />, title: "Secure Sessions", desc: "Ephemeral session data. No audio stored. JWT authentication." },
];

export default function ProductPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4">
            <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] bg-brand-purple/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-brand-purple text-xs tracking-[0.3em] uppercase mb-4">The Product</p>
                    <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
                        A U R A{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-violet-400">
                            Agent
                        </span>
                    </h1>
                    <p className="text-zinc-500 tracking-widest text-sm max-w-2xl mx-auto leading-relaxed">
                        An AI-powered voice agent that understands context, speaks naturally, and adapts to your business knowledge in real time.
                    </p>
                </motion.div>

                {/* Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-24 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 md:p-12"
                >
                    <h2 className="text-lg tracking-[0.2em] text-zinc-300 uppercase mb-6">How It Works</h2>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-between">
                        {["Upload PDF Context", "Speak Into Mic", "AI Processes via RAG", "Hear TTS Response"].map((step, i) => (
                            <div key={step} className="flex items-center gap-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple font-bold text-sm mb-3">
                                        {i + 1}
                                    </div>
                                    <p className="text-xs tracking-widest text-zinc-400 max-w-[120px]">{step.toUpperCase()}</p>
                                </div>
                                {i < 3 && <div className="hidden md:block w-16 h-px bg-white/10" />}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {specs.map((spec, i) => (
                        <motion.div
                            key={spec.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                            className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-brand-purple/30 hover:bg-brand-purple/[0.03] transition-all duration-300"
                        >
                            <div className="text-brand-purple mb-4 group-hover:scale-110 transition-transform duration-300">{spec.icon}</div>
                            <h3 className="text-sm tracking-[0.15em] text-white mb-2">{spec.title.toUpperCase()}</h3>
                            <p className="text-xs tracking-wider text-zinc-500 leading-relaxed">{spec.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

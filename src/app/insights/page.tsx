"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Lightbulb, Clock } from "lucide-react";

const insights = [
    { icon: <TrendingUp className="w-5 h-5" />, title: "Voice AI Market Growth", desc: "The conversational AI market is projected to reach $32.6B by 2030, growing at 20% CAGR.", tag: "MARKET" },
    { icon: <BarChart3 className="w-5 h-5" />, title: "RAG Accuracy Boost", desc: "Retrieval-Augmented Generation improves LLM accuracy by up to 40% compared to vanilla prompting.", tag: "RESEARCH" },
    { icon: <Lightbulb className="w-5 h-5" />, title: "Multilingual Support", desc: "Sarvam AI's speech models now support 12+ Indian languages with near-native fluency.", tag: "TECHNOLOGY" },
    { icon: <Clock className="w-5 h-5" />, title: "Response Latency", desc: "End-to-end voice pipeline under 2 seconds: STT (400ms) + RAG (600ms) + TTS (800ms).", tag: "PERFORMANCE" },
];

export default function InsightsPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4">
            <div className="fixed bottom-0 right-1/4 w-[40vw] h-[40vw] bg-violet-500/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-brand-purple text-xs tracking-[0.3em] uppercase mb-4">Intelligence</p>
                    <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-4">
                        Insights
                    </h1>
                    <p className="text-zinc-500 tracking-widest text-sm max-w-xl mx-auto leading-relaxed">
                        Industry trends, research findings, and performance benchmarks.
                    </p>
                </motion.div>

                <div className="space-y-5">
                    {insights.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                            className="group flex gap-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-brand-purple/20 hover:bg-brand-purple/[0.02] transition-all duration-300"
                        >
                            <div className="text-brand-purple mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-sm tracking-[0.15em] text-white">{item.title.toUpperCase()}</h3>
                                    <span className="text-[9px] tracking-[0.2em] text-brand-purple/70 bg-brand-purple/10 px-2.5 py-0.5 rounded-full">{item.tag}</span>
                                </div>
                                <p className="text-xs tracking-wider text-zinc-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-center text-zinc-600 text-xs tracking-[0.2em] uppercase mt-16"
                >
                    More insights coming soon — Stay tuned
                </motion.p>
            </div>
        </main>
    );
}

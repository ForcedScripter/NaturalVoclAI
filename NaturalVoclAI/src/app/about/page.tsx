"use client";

import { motion } from "framer-motion";

const team = [
    { name: "Project MINISTROS", role: "AI Voice Agent Platform", initial: "M" },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FFFDF5] text-[#3D2E1A] pt-32 pb-24 px-4">
            <div className="fixed top-0 right-1/4 w-[40vw] h-[40vw] bg-brand-gold/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Who We Are</p>
                    <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
                        About{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#DEB664]">
                            MINISTROS
                        </span>
                    </h1>
                    <p className="text-[#8B7355] tracking-widest text-sm max-w-2xl mx-auto leading-relaxed">
                        Building the next generation of AI-powered customer service — voice-first, context-aware, and multilingual.
                    </p>
                </motion.div>

                {/* Mission */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-16 bg-[#C8923C]/[0.03] border border-[#C8923C]/10 rounded-3xl p-8 md:p-12"
                >
                    <h2 className="text-lg tracking-[0.2em] text-[#3D2E1A] uppercase mb-6">Our Mission</h2>
                    <p className="text-sm tracking-wider text-[#8B7355] leading-relaxed mb-4">
                        MINISTROS was born from the belief that customer service should feel natural, not robotic. We combine cutting-edge AI technologies — speech recognition, retrieval-augmented generation, and natural text-to-speech — into a seamless voice agent that understands context and speaks with empathy.
                    </p>
                    <p className="text-sm tracking-wider text-[#8B7355] leading-relaxed">
                        Our pipeline processes voice input in under 700  milliseconds, searches your uploaded knowledge base for relevant context,provides end to end ticket resolutions using advanced multistep reasoning AI agents and delivers a spoken response that feels genuinely human.
                    </p>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-lg tracking-[0.2em] text-[#3D2E1A] uppercase mb-8 text-center">The crew</h2>
                    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            { name: "Harshil B S", cat: "Software Developer" },
                            { name: "Shriyaa S K", cat: "RAG-AI Engineer" },
                            { name: "Vishal hariharan K K", cat: "Generative-AI Architect" },
                        ].map((tech, i) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                className="bg-[#C8923C]/[0.03] border border-[#C8923C]/10 rounded-xl p-4 text-center hover:border-brand-gold/20 transition-colors duration-300 min-w-0"
                            >
                                <p className="text-xs tracking-[0.15em] text-[#3D2E1A] mb-1">{tech.name.toUpperCase()}</p>
                                <p className="text-[10px] tracking-widest text-brand-gold/60">{tech.cat}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

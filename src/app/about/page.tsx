"use client";

import { motion } from "framer-motion";
import { Code2, BrainCircuit, Sparkles, type LucideIcon } from "lucide-react";

const CREW: {
    name: string;
    role: string;
    icon: LucideIcon;
    accent: string;
    glow: string;
}[] = [
    {
        name: "Harshil B S",
        role: "Software Developer",
        icon: Code2,
        accent: "#C8923C",
        glow: "rgba(200,146,60,0.35)",
    },
    {
        name: "Shriyaa S K",
        role: "RAG-AI Engineer",
        icon: BrainCircuit,
        accent: "#5E8B7E",
        glow: "rgba(94,139,126,0.35)",
    },
    {
        name: "Vishal hariharan K K",
        role: "Generative-AI Architect",
        icon: Sparkles,
        accent: "#A87530",
        glow: "rgba(168,117,48,0.35)",
    },
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
                        Our pipeline processes voice input in under 700 milliseconds, searches your uploaded knowledge base for relevant context, provides end-to-end ticket resolutions using advanced multistep reasoning AI agents, and delivers a spoken response that feels genuinely human.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-lg tracking-[0.2em] text-[#3D2E1A] uppercase mb-10 text-center">
                        The crew
                    </h2>

                    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 place-items-stretch">
                        {CREW.map((member, i) => {
                            const Icon = member.icon;
                            return (
                                <motion.article
                                    key={member.name}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -4 }}
                                    className="group flex flex-col items-center text-center rounded-2xl border border-[#C8923C]/12 bg-[#FFFDF5]/80 p-6 md:p-8 hover:border-[#C8923C]/30 hover:shadow-lg hover:shadow-[#C8923C]/10 transition-all duration-300"
                                >
                                    <div
                                        className="relative mb-5 flex h-[72px] w-[72px] md:h-20 md:w-20 items-center justify-center rounded-full border-2"
                                        style={{
                                            borderColor: `${member.accent}44`,
                                            background: `linear-gradient(145deg, ${member.accent}18, rgba(255,253,245,0.9))`,
                                            boxShadow: `0 12px 32px -8px ${member.glow}`,
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: `radial-gradient(circle, ${member.glow}, transparent 70%)`,
                                            }}
                                        />
                                        <Icon
                                            className="relative z-10 w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:scale-110"
                                            style={{ color: member.accent }}
                                            strokeWidth={1.5}
                                            aria-hidden
                                        />
                                    </div>

                                    <h3 className="text-xs md:text-sm font-medium tracking-[0.12em] text-[#3D2E1A] uppercase leading-snug mb-2 min-h-[2.5rem] flex items-center justify-center">
                                        {member.name}
                                    </h3>

                                    <p
                                        className="text-[10px] md:text-xs tracking-[0.2em] uppercase"
                                        style={{ color: member.accent }}
                                    >
                                        {member.role}
                                    </p>
                                </motion.article>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

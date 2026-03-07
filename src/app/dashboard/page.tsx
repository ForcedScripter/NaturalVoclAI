"use client";

import { motion } from "framer-motion";
import { Construction, Wrench, Rocket } from "lucide-react";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
            <div className="fixed top-1/3 left-1/3 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[200px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center max-w-lg"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-brand-purple/10 border border-brand-purple/20 mb-8"
                >
                    <Construction className="w-10 h-10 text-brand-purple" />
                </motion.div>

                <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-4">
                    Under{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-violet-400">
                        Development
                    </span>
                </h1>

                <p className="text-zinc-500 tracking-widest text-sm max-w-md mx-auto leading-relaxed mb-10">
                    We&apos;re building your dashboard experience. Analytics, session history, and usage insights — coming soon.
                </p>

                <div className="flex items-center justify-center gap-8 text-zinc-600">
                    <div className="flex flex-col items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        <span className="text-[10px] tracking-[0.2em]">BUILDING</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-center gap-2">
                        <Rocket className="w-5 h-5" />
                        <span className="text-[10px] tracking-[0.2em]">SOON</span>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

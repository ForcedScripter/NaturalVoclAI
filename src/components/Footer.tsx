"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Audio waveform canvas background
function WaveformCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        const w = () => canvas.offsetWidth;
        const h = () => canvas.offsetHeight;

        const barCount = 80;
        const barSpacing = 2;

        const draw = (time: number) => {
            const cw = w();
            const ch = h();
            ctx.clearRect(0, 0, cw, ch);

            const barWidth = (cw - (barCount - 1) * barSpacing) / barCount;
            const centerY = ch * 0.5;

            for (let i = 0; i < barCount; i++) {
                const x = i * (barWidth + barSpacing);
                const t = time * 0.001;

                // Create organic waveform using overlapping sine waves
                const amp1 = Math.sin(i * 0.12 + t * 1.2) * 0.4;
                const amp2 = Math.sin(i * 0.08 + t * 0.8 + 2) * 0.3;
                const amp3 = Math.sin(i * 0.2 + t * 1.8 + 5) * 0.15;
                const amp4 = Math.cos(i * 0.05 + t * 0.5) * 0.15;

                const amplitude = (amp1 + amp2 + amp3 + amp4);
                const barH = Math.abs(amplitude) * ch * 0.35 + 2;

                // Gradient from brand purple to deep violet
                const hue = 270 + i * 0.5;
                const lightness = 25 + Math.abs(amplitude) * 30;
                const alpha = 0.3 + Math.abs(amplitude) * 0.5;

                ctx.fillStyle = `hsla(${hue}, 70%, ${lightness}%, ${alpha})`;

                // Draw symmetric bars from center
                const radius = Math.min(barWidth / 2, 3);
                const yTop = centerY - barH;
                const yBot = centerY;

                // Top half
                ctx.beginPath();
                ctx.roundRect(x, yTop, barWidth, barH, radius);
                ctx.fill();

                // Bottom half (mirror)
                ctx.beginPath();
                ctx.roundRect(x, yBot, barWidth, barH, radius);
                ctx.fill();
            }

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        />
    );
}

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Demo", href: "/#demo" },
            { label: "Features", href: "/features" },
            { label: "Insights", href: "/insights" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Dashboard", href: "/dashboard" },
        ],
    },
    {
        title: "Connect",
        links: [
            { label: "GitHub", href: "https://github.com/v-i-s-h-a-l-l/Customer_Service_AI" },
            { label: "Contact", href: "#" },
        ],
    },
];

export default function Footer() {
    const [currentYear] = useState(new Date().getFullYear());

    return (
        <footer className="relative w-full bg-[#050505] overflow-hidden">
            {/* Divider line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-600/30 to-transparent" />

            {/* Waveform background */}
            <div className="relative">
                <WaveformCanvas />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-10">

                    {/* Top section — CTA + tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        {/* Animated sound icon */}
                        <div className="flex items-center justify-center gap-[3px] mb-6">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-[3px] rounded-full bg-gradient-to-t from-purple-600 to-purple-400"
                                    animate={{
                                        height: [8, 20 + i * 6, 8],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                            <div className="mx-3">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-8 h-8 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                                    />
                                </svg>
                            </div>
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={`r-${i}`}
                                    className="w-[3px] rounded-full bg-gradient-to-t from-purple-600 to-purple-400"
                                    animate={{
                                        height: [8, 20 + (4 - i) * 6, 8],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: (4 - i) * 0.15,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                        </div>

                        <h2 className="text-3xl md:text-5xl font-light tracking-[0.25em] text-white uppercase mb-4">
                            MINISTROS
                        </h2>
                        <p className="text-zinc-500 tracking-[0.15em] text-xs md:text-sm max-w-lg mx-auto leading-relaxed uppercase">
                            Voice-First AI Customer Service — Speak, Listen, Resolve
                        </p>
                    </motion.div>

                    {/* Links grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16 max-w-2xl mx-auto">
                        {footerLinks.map((group) => (
                            <div key={group.title}>
                                <h4 className="text-[10px] tracking-[0.3em] text-purple-400 uppercase mb-4 font-medium">
                                    {group.title}
                                </h4>
                                <ul className="space-y-2.5">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="text-zinc-500 hover:text-white text-sm tracking-wider transition-colors duration-300"
                                                target={link.href.startsWith("http") ? "_blank" : undefined}
                                                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-zinc-600 text-[11px] tracking-[0.2em] uppercase">
                            © {currentYear} Ministros AI · All rights reserved
                        </p>
                        <div className="flex items-center gap-4">
                            {/* Subtle equalizer animation */}
                            <div className="flex items-end gap-[2px] h-3">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-[2px] bg-purple-600/40 rounded-full"
                                        animate={{ height: [3, 8 + i * 2, 3] }}
                                        transition={{
                                            duration: 0.8 + i * 0.2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-zinc-700 text-[10px] tracking-[0.15em]">
                                POWERED BY VOICE
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

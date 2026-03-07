"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

/* ─── Animated Audio Waveform Canvas ─── */
function HeroWaveform() {
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

        const draw = (t: number) => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;
            const time = t * 0.001;

            // Draw three concentric waveform rings
            for (let ring = 0; ring < 3; ring++) {
                const baseRadius = 100 + ring * 65;
                const alpha = 0.12 - ring * 0.03;
                const hue = 270 + ring * 12;
                const points = 128;

                ctx.beginPath();
                for (let i = 0; i <= points; i++) {
                    const angle = (i / points) * Math.PI * 2;

                    // Audio-like waveform distortion
                    const wave1 = Math.sin(angle * 8 + time * 1.5 + ring) * 12;
                    const wave2 = Math.sin(angle * 12 + time * 2.3 - ring * 2) * 8;
                    const wave3 = Math.cos(angle * 5 + time * 0.7 + ring * 3) * 6;
                    const pulse = Math.sin(time + ring) * 4;

                    const r = baseRadius + wave1 + wave2 + wave3 + pulse;
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = `hsla(${hue}, 80%, 55%, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Center glow dot
            const glowR = 3 + Math.sin(time * 2) * 1.5;
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR * 12);
            gradient.addColorStop(0, "rgba(168, 85, 247, 0.3)");
            gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR * 12, 0, Math.PI * 2);
            ctx.fill();

            // Bright center
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(168, 85, 247, 0.6)";
            ctx.fill();

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
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.6 }}
        />
    );
}

export default function HeroSection() {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]">

            {/* Waveform Canvas */}
            <HeroWaveform />

            {/* Subtle radial glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] md:w-[25vw] md:h-[25vw] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="relative z-10 text-center px-4"
            >
                {/* Animated sound bars above title */}
                <motion.div
                    className="flex items-end justify-center gap-[3px] mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-[2px] rounded-full bg-gradient-to-t from-purple-700/60 to-purple-400/80"
                            animate={{
                                height: [6, 14 + Math.abs(i - 3) * 5, 6],
                            }}
                            transition={{
                                duration: 1 + (i % 3) * 0.3,
                                repeat: Infinity,
                                delay: i * 0.12,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-7xl font-light tracking-[0.2em] md:tracking-[0.4em] text-white mb-6 uppercase"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    Speak to the<br />
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-purple">Future</span>
                </motion.h1>

                <motion.p
                    className="text-zinc-400 text-sm md:text-lg tracking-widest max-w-2xl mx-auto leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    EXPERIENCE SEAMLESS REAL-TIME AI CONVERSATIONS, POWERED BY CONTEXT-AWARE INTELLIGENCE.
                </motion.p>


            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="text-xs text-zinc-600 tracking-[0.3em] uppercase">Scroll to explore</span>
                <motion.div
                    className="w-[1px] h-12 bg-gradient-to-b from-purple-500/50 to-transparent"
                    animate={{
                        scaleY: [0, 1, 0],
                        originY: [0, 0, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </section>
    );
}

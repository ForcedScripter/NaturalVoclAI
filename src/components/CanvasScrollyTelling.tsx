"use client";

import { useRef, useEffect, useCallback } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";

export default function CanvasScrollyTelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Total frames in the sequence-1 folder based on our inspection
    const totalFrames = 120;
    const { images, loaded } = useImagePreloader(totalFrames, "/sequence-1");

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Calculate the current frame index (0 to 119)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

    const render = useCallback((val: number) => {
        if (!loaded || !canvasRef.current) return;

        const canvas = canvasRef.current;

        // Ensure canvas dimensions are initialized gracefully
        if (canvas.width === 0 || canvas.height === 0 || canvas.width === 300) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const currentFrame = Math.floor(val);
        const img = images[currentFrame];

        if (img) {
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.width || 1;
            const ih = img.height || 1;

            const scale = Math.max(cw / iw, ch / ih);
            const x = cw / 2 - (iw * scale) / 2;
            const y = ch / 2 - (ih * scale) / 2;

            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, x, y, iw * scale, ih * scale);

            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, cw, ch);
        }
    }, [loaded, images]);

    useMotionValueEvent(frameIndex, "change", (latest) => {
        requestAnimationFrame(() => render(latest));
    });

    useEffect(() => {
        if (loaded) {
            render(frameIndex.get());
        }
    }, [loaded, frameIndex, render]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Text Animations based on scroll position
    const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0, 0.3], [100, -100]);

    const text2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
    const text2Y = useTransform(scrollYProgress, [0.35, 0.65], [100, -100]);

    const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1], [0, 1, 1, 0]);
    const text3Y = useTransform(scrollYProgress, [0.7, 1], [100, -100]);

    return (
        <section ref={containerRef} className="relative h-[400vh] w-full bg-[#050505]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-t-2 border-brand-purple rounded-full animate-spin"></div>
                            <p className="text-zinc-500 tracking-widest text-sm uppercase">Loading Sequence...</p>
                        </div>
                    </div>
                )}

                {/* The sequence canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

                {/* Overlay Storytelling Content */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">

                    <motion.div
                        style={{ opacity: text1Opacity, y: text1Y }}
                        className="absolute text-center px-4"
                    >
                        <h2 className="text-3xl md:text-6xl font-bold tracking-[0.2em] mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                            Zero Latency.<br />Natural Tone.
                        </h2>
                        <p className="text-zinc-400 tracking-widest max-w-xl mx-auto text-sm md:text-base">
                            AN AUDITORY EXPERIENCE METICULOUSLY CRAFTED TO BEND THE BOUNDARIES OF HUMAN AND MACHINE INTERACTION.
                        </p>
                    </motion.div>

                    <motion.div
                        style={{ opacity: text2Opacity, y: text2Y }}
                        className="absolute text-center px-4"
                    >
                        <h2 className="text-3xl md:text-6xl font-bold tracking-[0.2em] mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-white">
                            Adaptive<br />Intelligence
                        </h2>
                        <p className="text-zinc-400 tracking-widest max-w-xl mx-auto text-sm md:text-base">
                            UPLOAD YOUR CONTEXT. LET THE LLM ADAPT DYNAMICALLY, RESPONDING PRECISELY WHEN YOU NEED IT.
                        </p>
                    </motion.div>

                    <motion.div
                        style={{ opacity: text3Opacity, y: text3Y }}
                        className="absolute text-center px-4"
                    >
                        <h2 className="text-3xl md:text-6xl font-bold tracking-[0.2em] mb-4 uppercase text-white">
                            Hyper-Realistic<br />Immersion
                        </h2>
                        <p className="text-zinc-400 tracking-widest max-w-xl mx-auto text-sm md:text-base">
                            SEAMLESS CONVERSATIONAL FLOW WITH NO AWKWARD PAUSES ALONG THE WAY.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

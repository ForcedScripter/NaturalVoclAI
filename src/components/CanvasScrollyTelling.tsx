"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";

export default function CanvasScrollyTelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = useState(false);
    const rafRef = useRef<number>(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Scrub the video's currentTime based on scroll progress
    const seekTo = useCallback((progress: number) => {
        const video = videoRef.current;
        if (!video || !videoReady || !isFinite(video.duration)) return;

        // Clamp to valid range
        const targetTime = Math.max(0, Math.min(progress * video.duration, video.duration - 0.01));

        // Only seek if the difference is meaningful to avoid jitter
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
            video.currentTime = targetTime;
        }
    }, [videoReady]);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => seekTo(latest));
    });

    // Initial seek once video is ready
    useEffect(() => {
        if (videoReady) {
            seekTo(scrollYProgress.get());
        }
    }, [videoReady, scrollYProgress, seekTo]);

    // Text Animations based on scroll position
    const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0, 0.3], [100, -100]);

    const text2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
    const text2Y = useTransform(scrollYProgress, [0.35, 0.65], [100, -100]);

    const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1], [0, 1, 1, 0]);
    const text3Y = useTransform(scrollYProgress, [0.7, 1], [100, -100]);

    return (
        <section ref={containerRef} className="relative h-[400vh] w-full bg-[#FFFDF5]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Loading state */}
                {!videoReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FFFDF5] z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-t-2 border-[#C8923C] rounded-full animate-spin"></div>
                            <p className="text-[#B8A080] tracking-widest text-sm uppercase">Loading...</p>
                        </div>
                    </div>
                )}

                {/* The scrollytelling video — scrubbed by scroll */}
                <video
                    ref={videoRef}
                    src="/scrollytelling.mp4"
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => setVideoReady(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        filter: "brightness(1.05) sepia(0.08)",
                    }}
                />

                {/* Warm overlay to match the site palette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "rgba(255, 253, 245, 0.25)" }}
                />

                {/* Overlay Storytelling Content */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">

                    <motion.div
                        style={{ opacity: text1Opacity, y: text1Y }}
                        className="absolute text-center px-4"
                    >
                        <h2 className="text-3xl md:text-6xl font-bold tracking-[0.2em] mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFF5DC]">
                            Zero Latency.<br />Natural Tone.
                        </h2>
                        <p className="text-white/80 tracking-widest max-w-xl mx-auto text-sm md:text-base">
                            AN AUDITORY EXPERIENCE METICULOUSLY CRAFTED TO BEND THE BOUNDARIES OF HUMAN AND MACHINE INTERACTION.
                        </p>
                    </motion.div>

                    <motion.div
                        style={{ opacity: text2Opacity, y: text2Y }}
                        className="absolute text-center px-4"
                    >
                        <h2 className="text-3xl md:text-6xl font-bold tracking-[0.2em] mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#F5DCA0] to-white">
                            Adaptive<br />Intelligence
                        </h2>
                        <p className="text-white/80 tracking-widest max-w-xl mx-auto text-sm md:text-base">
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
                        <p className="text-white/80 tracking-widest max-w-xl mx-auto text-sm md:text-base">
                            SEAMLESS CONVERSATIONAL FLOW WITH NO AWKWARD PAUSES ALONG THE WAY.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

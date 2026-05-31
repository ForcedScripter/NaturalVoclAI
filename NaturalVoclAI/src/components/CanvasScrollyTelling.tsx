"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";

// ─── Config ────────────────────────────────────────────────────────────────────
const FRAME_COUNT = 120;
const IMG_PATH = "/sequence-1/ezgif-frame-";

// Build the full list of image URLs once
function getFrameUrl(index: number): string {
    const padded = String(index).padStart(3, "0");
    return `${IMG_PATH}${padded}.jpg`;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CanvasScrollyTelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number>(0);
    const [loadProgress, setLoadProgress] = useState(0);
    const [ready, setReady] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // ── Preload ALL frames eagerly into memory ─────────────────────────────────
    useEffect(() => {
        let loaded = 0;
        const images: HTMLImageElement[] = new Array(FRAME_COUNT);
        let cancelled = false;

        const onLoad = () => {
            loaded++;
            if (!cancelled) {
                setLoadProgress(loaded / FRAME_COUNT);
            }
            if (loaded === FRAME_COUNT && !cancelled) {
                imagesRef.current = images;
                setReady(true);
                // Draw the initial frame
                renderFrame(0);
            }
        };

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFrameUrl(i + 1); // frames are 1-indexed
            img.onload = onLoad;
            img.onerror = onLoad; // still count errors to avoid stuck progress
            images[i] = img;
        }

        return () => {
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Draw a specific frame to the canvas ────────────────────────────────────
    const renderFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const images = imagesRef.current;
        if (!canvas || !images.length) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const img = images[frameIndex];
        if (!img || !img.complete || !img.naturalWidth) return;

        // Size the canvas to match the viewport at device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cw = rect.width * dpr;
        const ch = rect.height * dpr;

        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw;
            canvas.height = ch;
        }

        // Cover-fit the image (same as object-fit: cover)
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = cw / ch;

        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

        if (imgAspect > canvasAspect) {
            // Image is wider — crop sides
            sw = img.naturalHeight * canvasAspect;
            sx = (img.naturalWidth - sw) / 2;
        } else {
            // Image is taller — crop top/bottom
            sh = img.naturalWidth / canvasAspect;
            sy = (img.naturalHeight - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }, []);

    // ── Respond to scroll → pick and render the right frame ────────────────────
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!ready) return;

        // Map scroll progress [0..1] to frame index [0..FRAME_COUNT-1]
        const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.round(latest * (FRAME_COUNT - 1)))
        );

        // Only redraw if the frame actually changed
        if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => renderFrame(frameIndex));
        }
    });

    // ── Handle window resize → redraw current frame at new dimensions ──────────
    useEffect(() => {
        if (!ready) return;

        const handleResize = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() =>
                renderFrame(currentFrameRef.current)
            );
        };

        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, [ready, renderFrame]);

    // ── Draw initial frame once ready ──────────────────────────────────────────
    useEffect(() => {
        if (ready) {
            const initialFrame = Math.round(scrollYProgress.get() * (FRAME_COUNT - 1));
            currentFrameRef.current = initialFrame;
            renderFrame(initialFrame);
        }
    }, [ready, scrollYProgress, renderFrame]);

    // Text Animations based on scroll position
    const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0, 0.3], [100, -100]);

    const text2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
    const text2Y = useTransform(scrollYProgress, [0.35, 0.65], [100, -100]);

    const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1], [0, 1, 1, 0]);
    const text3Y = useTransform(scrollYProgress, [0.7, 1], [100, -100]);

    // Loading percentage for display
    const loadPct = Math.round(loadProgress * 100);

    return (
        <section ref={containerRef} className="relative h-[400vh] w-full bg-[#FFFDF5]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Loading state with progress */}
                {!ready && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FFFDF5] z-10">
                        <div className="flex flex-col items-center gap-5">
                            {/* Circular progress */}
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                    <circle
                                        cx="32" cy="32" r="28"
                                        fill="none"
                                        stroke="rgba(200,146,60,0.15)"
                                        strokeWidth="3"
                                    />
                                    <circle
                                        cx="32" cy="32" r="28"
                                        fill="none"
                                        stroke="#C8923C"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${loadProgress * 175.9} 175.9`}
                                        style={{ transition: "stroke-dasharray 0.15s ease" }}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[11px] tracking-widest font-semibold text-[#C8923C]">
                                    {loadPct}%
                                </span>
                            </div>
                            <p className="text-[#B8A080] tracking-[0.25em] text-[10px] uppercase">
                                Loading experience
                            </p>
                        </div>
                    </div>
                )}

                {/* The scrollytelling canvas — frame-perfect image sequence */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        filter: "brightness(1.05) sepia(0.08)",
                        imageRendering: "auto",
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

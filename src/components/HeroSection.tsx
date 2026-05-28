"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScenarioTheater from "./ScenarioTheater";

// ─── Hotspot definitions ───────────────────────────────────────────────────────
// Zones are large, covering entire building areas per the reference layout.
const HOTSPOTS = [
    {
        id: "return",
        label: "Customer Return",
        emoji: "📦",
        // Zone center
        top: "62%",
        left: "30%",
        // Large circular hit zone (vw-based for responsiveness)
        zoneWidth: "22vw",
        zoneHeight: "22vw",
        description: "Seamless returns via voice AI — no hold music, no frustration.",
        withoutAi: "/demos/return-without-ai.mp4",
        withAi: "/demos/return-with-ai.mp4",
    },
    {
        id: "service",
        label: "Customer Service",
        emoji: "🎧",
        top: "40%",
        left: "50%",
        // Tall oval for the skyscraper
        zoneWidth: "20vw",
        zoneHeight: "28vw",
        description: "Intelligent call handling that resolves in seconds, not minutes.",
        withoutAi: "/demos/service-without-ai.mp4",
        withAi: "/demos/service-with-ai.mp4",
    },
    {
        id: "hotel",
        label: "Hotel Scenario",
        emoji: "🏨",
        top: "58%",
        left: "68%",
        zoneWidth: "20vw",
        zoneHeight: "20vw",
        description: "Voice-first concierge that handles bookings and queries 24/7.",
        withoutAi: "/demos/hotel-without-ai.mp4",
        withAi: "/demos/hotel-with-ai.mp4",
    },
] as const;

type HotspotId = (typeof HOTSPOTS)[number]["id"];

// ─── Main Hero Section ────────────────────────────────────────────────────────
export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
    const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId | null>(null);
    const [videoReady, setVideoReady] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    // Track mouse position globally
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleActivate = useCallback((id: HotspotId) => {
        setActiveHotspot(id);
    }, []);

    const handleClose = useCallback(() => {
        setActiveHotspot(null);
    }, []);

    const handleNavigate = useCallback((id: string) => {
        setActiveHotspot(id as HotspotId);
    }, []);

    const hoveredData = useMemo(
        () => HOTSPOTS.find((h) => h.id === hoveredHotspot),
        [hoveredHotspot]
    );

    // Prepare scenarios array for the theater
    const scenarios = useMemo(
        () =>
            HOTSPOTS.map((h) => ({
                id: h.id,
                label: h.label,
                emoji: h.emoji,
                description: h.description,
                withoutAi: h.withoutAi,
                withAi: h.withAi,
            })),
        []
    );

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden"
        >
            {/* ── Background video ───────────────────────────────────────── */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: videoReady ? 1 : 0 }}
                transition={{ duration: 1.4 }}
            >
                <video
                    ref={videoRef}
                    src="/hero-loop.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onCanPlay={() => setVideoReady(true)}
                    className="w-full h-full object-cover object-center"
                    // @ts-expect-error -- fetchPriority is valid on video in modern browsers
                    fetchPriority="high"
                />
                {/* Gradient overlays for legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5]/70 via-[#FFFDF5]/20 to-[#FFFDF5]/75" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#FFFDF590_100%)]" />
            </motion.div>

            {/* Loading fallback */}
            {!videoReady && (
                <div className="absolute inset-0 z-0 bg-[#FFFDF5] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#C8923C]/30 border-t-[#C8923C] rounded-full animate-spin" />
                </div>
            )}

            {/* ── Large Hotspot Hit Zones (building-sized) ────────────────── */}
            <div className="absolute inset-0 z-20">
                {HOTSPOTS.map((h) => (
                    <div
                        key={h.id}
                        className="absolute"
                        style={{
                            top: h.top,
                            left: h.left,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        {/* Large invisible hit zone covering the building area */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleActivate(h.id);
                            }}
                            onMouseEnter={() => setHoveredHotspot(h.id)}
                            onMouseLeave={() => setHoveredHotspot(null)}
                            className="relative rounded-full cursor-pointer"
                            style={{
                                width: h.zoneWidth,
                                height: h.zoneHeight,
                                background: "transparent",
                            }}
                            aria-label={`View ${h.label} scenario`}
                        />
                    </div>
                ))}
            </div>

            {/* ── Cursor Glow + Proximity Label ─────────────────────────── */}
            <AnimatePresence>
                {hoveredData && (
                    <>
                        {/* Warm radial glow around cursor */}
                        <motion.div
                            className="fixed pointer-events-none z-[90]"
                            style={{
                                left: mouse.x,
                                top: mouse.y,
                                transform: "translate(-50%, -50%)",
                            }}
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.3 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div
                                className="w-28 h-28 rounded-full"
                                style={{
                                    background: "radial-gradient(circle, rgba(200,146,60,0.30) 0%, rgba(222,182,100,0.15) 40%, transparent 70%)",
                                    filter: "blur(2px)",
                                }}
                            />
                        </motion.div>

                        {/* Floating info text near cursor */}
                        <motion.div
                            className="fixed pointer-events-none z-[100]"
                            style={{
                                left: mouse.x + 22,
                                top: mouse.y + 22,
                            }}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <div
                                className="px-4 py-2.5 rounded-xl max-w-[220px]"
                                style={{
                                    background: "rgba(255,253,245,0.92)",
                                    backdropFilter: "blur(12px)",
                                    border: "1px solid rgba(200,146,60,0.18)",
                                    boxShadow: "0 8px 32px rgba(61,46,26,0.12), 0 0 20px rgba(200,146,60,0.08)",
                                }}
                            >
                                <p className="text-[11px] tracking-[0.15em] font-semibold uppercase text-[#C8923C] mb-0.5">
                                    {hoveredData.label}
                                </p>
                                <p className="text-[10px] tracking-wider text-[#8B7355] leading-snug">
                                    {hoveredData.description}
                                </p>
                                <p className="text-[9px] tracking-[0.2em] text-[#B8A080] mt-1.5 uppercase">
                                    Click to explore →
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Hint text ────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-none"
            >
                <span className="text-[9px] tracking-[0.3em] text-[#8B7355] uppercase">
                    Hover the scene to discover scenarios
                </span>
            </motion.div>

            {/* ── Title text ───────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="text-center"
                >
                    {/* Sound bars */}
                    <motion.div
                        className="flex items-end justify-center gap-[3px] mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        {[...Array(7)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-[2px] rounded-full bg-gradient-to-t from-[#C8923C]/60 to-[#DEB664]"
                                animate={{ height: [6, 14 + Math.abs(i - 3) * 5, 6] }}
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
                        className="text-4xl md:text-7xl font-light tracking-[0.15em] md:tracking-[0.3em] text-[#3D2E1A] mb-4 uppercase"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ textShadow: "0 2px 24px rgba(255,253,245,0.9)" }}
                    >
                        Speak to the
                        <br />
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8923C] to-[#DEB664]">
                            Future
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-[#6B5A42] text-sm md:text-base tracking-widest max-w-2xl mx-auto leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        style={{ textShadow: "0 1px 10px rgba(255,253,245,0.95)" }}
                    >
                        AI VOICE AGENTS THAT TRANSFORM REAL BUSINESSES
                    </motion.p>
                </motion.div>
            </div>

            {/* ── Scroll Indicator ──────────────────────────────────────── */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
            >
                <span className="text-xs text-[#8B7355] tracking-[0.3em] uppercase">
                    Scroll to explore
                </span>
                <motion.div
                    className="w-[1px] h-10 bg-gradient-to-b from-[#C8923C]/50 to-transparent"
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* ── Scenario Theater (full-screen overlay) ────────────────── */}
            <ScenarioTheater
                scenarios={scenarios}
                activeId={activeHotspot}
                onClose={handleClose}
                onNavigate={handleNavigate}
            />
        </section>
    );
}

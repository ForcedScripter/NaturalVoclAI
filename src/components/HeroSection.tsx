"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScenarioTheater from "./ScenarioTheater";

// ─── Hotspot definitions ───────────────────────────────────────────────────────
const HOTSPOTS = [
    {
        id: "return",
        label: "Customer Return",
        emoji: "📦",
        top: "62%",
        left: "30%",
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

// ─── Flip Card Video Preview ──────────────────────────────────────────────────
// Shows a premium flip-card near the hotspot: front = "Without AI", back = "With AI"
function FlipCardPreview({
    hotspot,
    anchorPosition,
}: {
    hotspot: (typeof HOTSPOTS)[number];
    anchorPosition: { x: number; y: number };
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const flipIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const withoutRef = useRef<HTMLVideoElement>(null);
    const withRef = useRef<HTMLVideoElement>(null);

    // Auto-flip every 3.5 seconds for dynamic feel
    useEffect(() => {
        flipIntervalRef.current = setInterval(() => {
            setIsFlipped((prev) => !prev);
        }, 3500);
        return () => clearInterval(flipIntervalRef.current);
    }, []);

    // Eagerly play both videos
    useEffect(() => {
        withoutRef.current?.play().catch(() => {});
        withRef.current?.play().catch(() => {});
    }, []);

    // Position the card intelligently based on hotspot location
    // Keep it within viewport bounds
    const cardWidth = 420;
    const cardHeight = 280;
    const margin = 24;

    const computedStyle = useMemo(() => {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
        const vh = typeof window !== "undefined" ? window.innerHeight : 1080;

        let left = anchorPosition.x;
        let top = anchorPosition.y - cardHeight - margin;

        // If it goes above viewport, place below
        if (top < margin) {
            top = anchorPosition.y + margin;
        }
        // If it goes off right edge
        if (left + cardWidth / 2 > vw - margin) {
            left = vw - margin - cardWidth / 2;
        }
        // If it goes off left edge
        if (left - cardWidth / 2 < margin) {
            left = margin + cardWidth / 2;
        }

        return { left, top };
    }, [anchorPosition, cardHeight]);

    return (
        <motion.div
            className="fixed z-[95] pointer-events-none"
            style={{
                left: computedStyle.left,
                top: computedStyle.top,
                transform: "translateX(-50%)",
                width: cardWidth,
                perspective: 1200,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Card container with 3D flip */}
            <div
                style={{
                    width: "100%",
                    height: cardHeight,
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* ── Front Face: Without AI ── */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        borderRadius: 20,
                        overflow: "hidden",
                        boxShadow:
                            "0 24px 64px rgba(0,0,0,0.35), 0 0 40px rgba(200,146,60,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    <video
                        ref={withoutRef}
                        src={hotspot.withoutAi}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for legibility */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to top, rgba(30,15,8,0.85) 0%, rgba(30,15,8,0.3) 40%, transparent 70%)",
                        }}
                    />
                    {/* Label badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{
                            background: "rgba(224,82,82,0.88)",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 4px 16px rgba(224,82,82,0.3)",
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] tracking-[0.15em] font-bold text-white uppercase">
                            Without AI
                        </span>
                    </div>
                    {/* Bottom text */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                        <p className="text-[11px] tracking-[0.15em] font-semibold uppercase text-[#FFA07A] mb-1">
                            {hotspot.emoji} {hotspot.label}
                        </p>
                        <p className="text-[10px] tracking-wider text-white/70 leading-snug">
                            {hotspot.description}
                        </p>
                    </div>
                    {/* Flip indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                            background: "rgba(0,0,0,0.4)",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <path d="M16 3h5v5" />
                            <path d="M21 3L9 15" />
                            <path d="M8 21H3v-5" />
                            <path d="M3 21l12-12" />
                        </svg>
                        <span className="text-[8px] tracking-[0.2em] text-white/80 uppercase">Auto-flip</span>
                    </div>
                </div>

                {/* ── Back Face: With AI ── */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        borderRadius: 20,
                        overflow: "hidden",
                        transform: "rotateY(180deg)",
                        boxShadow:
                            "0 24px 64px rgba(0,0,0,0.35), 0 0 40px rgba(200,146,60,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                        border: "1px solid rgba(200,146,60,0.25)",
                    }}
                >
                    <video
                        ref={withRef}
                        src={hotspot.withAi}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to top, rgba(20,35,10,0.85) 0%, rgba(20,35,10,0.3) 40%, transparent 70%)",
                        }}
                    />
                    {/* Label badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{
                            background: "rgba(200,146,60,0.92)",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 4px 16px rgba(200,146,60,0.3)",
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] tracking-[0.15em] font-bold text-white uppercase">
                            Ministros AI
                        </span>
                    </div>
                    {/* Bottom text */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                        <p className="text-[11px] tracking-[0.15em] font-semibold uppercase text-[#DEB664] mb-1">
                            {hotspot.emoji} {hotspot.label}
                        </p>
                        <p className="text-[10px] tracking-wider text-white/70 leading-snug">
                            AI-powered experience — faster resolution, higher satisfaction.
                        </p>
                    </div>
                    {/* Flip indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                            background: "rgba(0,0,0,0.4)",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DEB664" strokeWidth="2" strokeLinecap="round">
                            <path d="M16 3h5v5" />
                            <path d="M21 3L9 15" />
                            <path d="M8 21H3v-5" />
                            <path d="M3 21l12-12" />
                        </svg>
                        <span className="text-[8px] tracking-[0.2em] text-[#DEB664]/80 uppercase">Auto-flip</span>
                    </div>
                </div>
            </div>

            {/* Click hint below card */}
            <motion.div
                className="flex items-center justify-center gap-2 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div
                    className="px-4 py-2 rounded-xl flex items-center gap-2"
                    style={{
                        background: "rgba(255,253,245,0.92)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(200,146,60,0.2)",
                        boxShadow: "0 8px 32px rgba(61,46,26,0.15)",
                    }}
                >
                    <span className="text-[9px] tracking-[0.2em] text-[#C8923C] uppercase font-semibold">
                        Click to explore full comparison →
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Hero Section ────────────────────────────────────────────────────────
export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
    const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId | null>(null);
    const [videoReady, setVideoReady] = useState(false);
    const [hotspotAnchors, setHotspotAnchors] = useState<Record<string, { x: number; y: number }>>({});

    // Track the center position of each hotspot button for anchoring the flip card
    const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const updateAnchorPosition = useCallback((id: string) => {
        const el = hotspotRefs.current[id];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setHotspotAnchors((prev) => ({
            ...prev,
            [id]: { x: rect.left + rect.width / 2, y: rect.top },
        }));
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

    // ── Eagerly preload ALL scenario demo videos ───────────────────────────────
    useEffect(() => {
        HOTSPOTS.forEach((h) => {
            // Preload "without AI" video
            const linkWithout = document.createElement("link");
            linkWithout.rel = "preload";
            linkWithout.as = "video";
            linkWithout.href = h.withoutAi;
            document.head.appendChild(linkWithout);

            // Preload "with AI" video
            const linkWith = document.createElement("link");
            linkWith.rel = "preload";
            linkWith.as = "video";
            linkWith.href = h.withAi;
            document.head.appendChild(linkWith);
        });
    }, []);

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
                    style={{
                        willChange: "transform",
                        transform: "translateZ(0)",
                    }}
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
                            ref={(el) => { hotspotRefs.current[h.id] = el; }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleActivate(h.id);
                            }}
                            onMouseEnter={() => {
                                setHoveredHotspot(h.id);
                                updateAnchorPosition(h.id);
                            }}
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

            {/* ── Flip Card Video Preview on Hover ────────────────────────── */}
            <AnimatePresence>
                {hoveredData && hotspotAnchors[hoveredData.id] && (
                    <FlipCardPreview
                        key={hoveredData.id}
                        hotspot={hoveredData}
                        anchorPosition={hotspotAnchors[hoveredData.id]}
                    />
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

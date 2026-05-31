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

const BEACON_COLORS: Record<
    HotspotId,
    { primary: string; light: string; glow: string; ring: string }
> = {
    return: {
        primary: "#D9734A",
        light: "#F0A07A",
        glow: "rgba(217,115,74,0.45)",
        ring: "rgba(217,115,74,0.55)",
    },
    service: {
        primary: "#C8923C",
        light: "#DEB664",
        glow: "rgba(200,146,60,0.45)",
        ring: "rgba(200,146,60,0.55)",
    },
    hotel: {
        primary: "#5E8B7E",
        light: "#8FB8AA",
        glow: "rgba(94,139,126,0.45)",
        ring: "rgba(94,139,126,0.55)",
    },
};

// ─── Persistent building beacons (discoverability) ─────────────────────────────
function ScenarioBeacon({
    isSpotlight,
    colors,
}: {
    isSpotlight: boolean;
    colors: (typeof BEACON_COLORS)[HotspotId];
}) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Ripple rings — compact */}
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="absolute rounded-full border-2"
                    style={{
                        width: "28%",
                        height: "28%",
                        borderColor: colors.ring,
                    }}
                    animate={{
                        scale: isSpotlight ? [1, 1.28, 1] : [1, 1.18, 1],
                        opacity: isSpotlight ? [0.6, 0, 0.6] : [0.4, 0, 0.4],
                    }}
                    transition={{
                        duration: isSpotlight ? 2.2 : 3,
                        repeat: Infinity,
                        delay: i * 0.55,
                        ease: "easeOut",
                    }}
                />
            ))}

            {/* Core glow */}
            <motion.div
                className="absolute w-[20%] h-[20%] min-w-[16px] min-h-[16px] rounded-full blur-sm"
                style={{ backgroundColor: colors.glow }}
                animate={{
                    scale: isSpotlight ? [1, 1.25, 1] : [1, 1.12, 1],
                    opacity: isSpotlight ? [0.75, 1, 0.75] : [0.5, 0.7, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Pin dot */}
            <motion.div
                className={`relative z-10 rounded-full ${isSpotlight ? "w-5 h-5" : "w-4 h-4"}`}
                style={{
                    background: `linear-gradient(to bottom right, ${colors.light}, ${colors.primary})`,
                    boxShadow: `0 0 16px ${colors.glow}`,
                    outline: isSpotlight
                        ? `3px solid ${colors.ring}`
                        : `2px solid ${colors.ring}`,
                }}
                animate={{ y: isSpotlight ? [-2, 2, -2] : [-1, 1, -1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

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

    // Card layout: 16:9 media + footer + click hint (kept inside viewport)
    const cardWidth = typeof window !== "undefined" && window.innerWidth < 640 ? Math.min(340, window.innerWidth - 32) : 420;
    const videoHeight = cardWidth * (9 / 16);
    const footerHeight = 68;
    const clickHintHeight = 44;
    const cardStackHeight = videoHeight + footerHeight;
    const totalHeight = cardStackHeight + clickHintHeight;
    const margin = 24;

    const computedStyle = useMemo(() => {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
        const vh = typeof window !== "undefined" ? window.innerHeight : 1080;

        let left = anchorPosition.x;
        // Prefer above hotspot; fall back below if needed
        let top = anchorPosition.y - totalHeight - margin;

        if (top < margin) {
            top = anchorPosition.y + margin;
        }
        // Clamp so card + hint never clip at bottom (avoids overlapping hero copy)
        if (top + totalHeight > vh - margin) {
            top = Math.max(margin, vh - margin - totalHeight);
        }
        if (left + cardWidth / 2 > vw - margin) {
            left = vw - margin - cardWidth / 2;
        }
        if (left - cardWidth / 2 < margin) {
            left = margin + cardWidth / 2;
        }

        return { left, top, cardWidth, videoHeight, footerHeight, cardStackHeight };
    }, [anchorPosition, cardWidth, totalHeight, clickHintHeight]);

    return (
        <motion.div
            className="fixed z-[95] pointer-events-none"
            style={{
                left: computedStyle.left,
                top: computedStyle.top,
                transform: "translateX(-50%)",
                width: computedStyle.cardWidth,
                perspective: 1200,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Card: media frame (flip) + fixed footer (never clipped) */}
            <div
                className="rounded-[20px] overflow-hidden"
                style={{
                    boxShadow:
                        "0 24px 64px rgba(0,0,0,0.35), 0 0 40px rgba(200,146,60,0.12)",
                    border: "1px solid rgba(255,255,255,0.12)",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: computedStyle.videoHeight,
                        position: "relative",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    {/* ── Front Face: Without AI ── */}
                    <div
                        className="absolute inset-0 bg-[#1a1410]"
                        style={{
                            backfaceVisibility: "hidden",
                        }}
                    >
                        <video
                            ref={withoutRef}
                            src={hotspot.withoutAi}
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl pointer-events-none"
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
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg pointer-events-none"
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
                        className="absolute inset-0 bg-[#141a10]"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <video
                            ref={withRef}
                            src={hotspot.withAi}
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl pointer-events-none"
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
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg pointer-events-none"
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

                {/* Footer below video — always visible, not cropped by overflow */}
                <div
                    className="px-4 py-3 border-t border-white/10"
                    style={{
                        height: computedStyle.footerHeight,
                        background: isFlipped
                            ? "linear-gradient(to right, #2a2418, #1f1a12)"
                            : "linear-gradient(to right, #2a1810, #1f120c)",
                    }}
                >
                    <p
                        className="text-[11px] tracking-[0.15em] font-semibold uppercase mb-1"
                        style={{ color: isFlipped ? "#DEB664" : "#FFA07A" }}
                    >
                        {hotspot.emoji} {hotspot.label}
                    </p>
                    <p className="text-[10px] tracking-wider text-white/75 leading-snug line-clamp-2">
                        {isFlipped
                            ? "AI-powered experience — faster resolution, higher satisfaction."
                            : hotspot.description}
                    </p>
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
    const [spotlightId, setSpotlightId] = useState<HotspotId>("return");

    // Track the center position of each hotspot button for anchoring the flip card
    const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const updateAllAnchors = useCallback(() => {
        const next: Record<string, { x: number; y: number }> = {};
        HOTSPOTS.forEach((h) => {
            const el = hotspotRefs.current[h.id];
            if (!el) return;
            const rect = el.getBoundingClientRect();
            next[h.id] = { x: rect.left + rect.width / 2, y: rect.top };
        });
        if (Object.keys(next).length) setHotspotAnchors((prev) => ({ ...prev, ...next }));
    }, []);

    const updateAnchorPosition = useCallback((id: string) => {
        const el = hotspotRefs.current[id];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setHotspotAnchors((prev) => ({
            ...prev,
            [id]: { x: rect.left + rect.width / 2, y: rect.top },
        }));
    }, []);

    // Auto-cycle spotlight across buildings when user isn't interacting
    useEffect(() => {
        if (hoveredHotspot || activeHotspot) return;

        const interval = setInterval(() => {
            setSpotlightId((prev) => {
                const idx = HOTSPOTS.findIndex((h) => h.id === prev);
                return HOTSPOTS[(idx + 1) % HOTSPOTS.length].id;
            });
        }, 4200);

        return () => clearInterval(interval);
    }, [hoveredHotspot, activeHotspot]);

    useEffect(() => {
        updateAllAnchors();
        window.addEventListener("resize", updateAllAnchors);
        return () => window.removeEventListener("resize", updateAllAnchors);
    }, [updateAllAnchors, videoReady]);

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
                        {/* Discoverability beacons — hidden while preview or theater is open */}
                        <AnimatePresence>
                            {!hoveredHotspot && !activeHotspot && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ScenarioBeacon
                                        isSpotlight={spotlightId === h.id}
                                        colors={BEACON_COLORS[h.id]}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Large invisible hit zone covering the building area */}
                        <button
                            ref={(el) => { hotspotRefs.current[h.id] = el; }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleActivate(h.id);
                            }}
                            onMouseEnter={() => {
                                setHoveredHotspot(h.id);
                                setSpotlightId(h.id);
                                updateAnchorPosition(h.id);
                            }}
                            onMouseLeave={() => setHoveredHotspot(null)}
                            className="relative z-10 rounded-full cursor-pointer"
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

            {/* ── Hero tagline — four-road intersection (center of scene) ─── */}
            <AnimatePresence>
                {!hoveredHotspot && !activeHotspot && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.45 }}
                        className="absolute top-[78%] md:top-[73%] left-[51.5%] -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none"
                    >
                        <div
                            className="inline-block px-4 py-2.5 md:px-5 md:py-3 rounded-xl border border-[#C8923C]/18 shadow-sm shadow-[#C8923C]/5"
                            style={{
                                background: "rgba(255,253,245,0.82)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <p className="text-[11px] sm:text-xs md:text-sm font-light leading-[1.45] tracking-[0.02em] text-center whitespace-nowrap">
                                <span className="block text-[#3D2E1A]">
                                    From{" "}
                                    <span className="text-[#5C4A32] italic">
                                        &ldquo;How Can I Help?&rdquo;
                                    </span>
                                </span>
                                <span className="block mt-0.5">
                                    <span className="text-[#8B7355]">to </span>
                                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A87530] to-[#C8923C]">
                                        &ldquo;Issue Resolved.&rdquo;
                                    </span>
                                </span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

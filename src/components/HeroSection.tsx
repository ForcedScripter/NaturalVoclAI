"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Hotspot definitions ───────────────────────────────────────────────────────
const HOTSPOTS = [
    {
        id: "return",
        label: "Customer Return",
        emoji: "📦",
        top: "62%",
        left: "30%",
        color: "#E05252",
        glowColor: "rgba(224,82,82,0.35)",
        withoutAi: "/demos/return-without-ai.mp4",
        withAi: "/demos/return-with-ai.mp4",
        description: "Seamless returns via voice AI — no hold music, no frustration.",
    },
    {
        id: "service",
        label: "Customer Service",
        emoji: "🎧",
        top: "38%",
        left: "50%",
        color: "#4B8BDB",
        glowColor: "rgba(75,139,219,0.35)",
        withoutAi: "/demos/service-without-ai.mp4",
        withAi: "/demos/service-with-ai.mp4",
        description: "Intelligent call handling that resolves in seconds, not minutes.",
    },
    {
        id: "hotel",
        label: "Hotel Scenario",
        emoji: "🏨",
        top: "60%",
        left: "68%",
        color: "#4CAF7D",
        glowColor: "rgba(76,175,125,0.35)",
        withoutAi: "/demos/hotel-without-ai.mp4",
        withAi: "/demos/hotel-with-ai.mp4",
        description: "Voice-first concierge that handles bookings and queries 24/7.",
    },
] as const;

type HotspotId = (typeof HOTSPOTS)[number]["id"];

// ─── Custom Cursor Tooltip ────────────────────────────────────────────────────
// Follows the mouse inside the section with a context label
function CursorTooltip({
    label,
    color,
    mouseX,
    mouseY,
}: {
    label: string;
    color: string;
    mouseX: number;
    mouseY: number;
}) {
    return (
        <motion.div
            className="fixed pointer-events-none z-[100]"
            style={{ left: mouseX + 16, top: mouseY + 16 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.12 }}
        >
            <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.15em] text-white font-medium shadow-xl uppercase whitespace-nowrap"
                style={{
                    background: color,
                    boxShadow: `0 4px 20px ${color}60`,
                }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {label}
                <span className="opacity-60">→ click</span>
            </div>
        </motion.div>
    );
}

// ─── Scenario Panel — large before/after video comparison ────────────────────
function ScenarioPanel({
    hotspot,
    onClose,
}: {
    hotspot: (typeof HOTSPOTS)[number];
    onClose: () => void;
}) {
    const [activeTab, setActiveTab] = useState<"without" | "with">("without");
    const withoutRef = useRef<HTMLVideoElement>(null);
    const withRef = useRef<HTMLVideoElement>(null);

    // Preload both on mount
    useEffect(() => {
        withoutRef.current?.load();
        withRef.current?.load();
    }, []);

    // Autoplay "without ai" first
    useEffect(() => {
        withoutRef.current?.play().catch(() => {});
    }, []);

    // Switch videos on tab change — instant crossfade, no reload
    useEffect(() => {
        const active = activeTab === "without" ? withoutRef.current : withRef.current;
        const inactive = activeTab === "without" ? withRef.current : withoutRef.current;
        if (active) {
            active.currentTime = 0;
            active.play().catch(() => {});
        }
        if (inactive) inactive.pause();
    }, [activeTab]);

    // Smart panel positioning — stays on screen
    const panelStyle: React.CSSProperties = {
        position: "absolute",
        bottom: "calc(100% + 16px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.93 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={panelStyle}
            className="w-[520px] bg-[#FFFDF5]/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.22)] border border-white/60"
            onClick={(e) => e.stopPropagation()}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{
                    background: `linear-gradient(135deg, ${hotspot.color}18 0%, ${hotspot.color}08 100%)`,
                    borderBottom: `1px solid ${hotspot.color}20`,
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                        style={{
                            background: `${hotspot.color}20`,
                            border: `1px solid ${hotspot.color}30`,
                        }}
                    >
                        {hotspot.emoji}
                    </div>
                    <div>
                        <p
                            className="text-[12px] tracking-[0.18em] font-semibold uppercase"
                            style={{ color: hotspot.color }}
                        >
                            {hotspot.label}
                        </p>
                        <p className="text-[10px] tracking-wider text-[#8B7355] leading-tight max-w-[300px]">
                            {hotspot.description}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#B8A080] hover:text-[#3D2E1A] hover:bg-[#C8923C]/10 transition-all duration-200 text-base leading-none"
                >
                    ×
                </button>
            </div>

            {/* ── Tab Toggle ── */}
            <div className="flex gap-2 p-3 bg-[#FFF8EC]/80">
                {(["without", "with"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex-1 py-2.5 rounded-xl text-[11px] tracking-[0.12em] uppercase font-semibold transition-all duration-250"
                        style={
                            activeTab === tab
                                ? {
                                    background:
                                        tab === "with"
                                            ? `${hotspot.color}20`
                                            : "rgba(224,82,82,0.12)",
                                    color:
                                        tab === "with" ? hotspot.color : "#E05252",
                                    border: `1.5px solid ${tab === "with" ? hotspot.color + "50" : "#E0525250"}`,
                                    boxShadow:
                                        tab === "with"
                                            ? `0 2px 12px ${hotspot.color}25`
                                            : "0 2px 12px rgba(224,82,82,0.15)",
                                }
                                : {
                                    color: "#B8A080",
                                    border: "1.5px solid transparent",
                                    background: "transparent",
                                }
                        }
                    >
                        {tab === "without" ? "❌  Without AI" : "✅  With Ministros AI"}
                    </button>
                ))}
            </div>

            {/* ── Video ── */}
            <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                {/* Both videos always mounted — just fade between them */}
                <video
                    ref={withoutRef}
                    src={hotspot.withoutAi}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        opacity: activeTab === "without" ? 1 : 0,
                        transition: "opacity 0.3s ease",
                    }}
                />
                <video
                    ref={withRef}
                    src={hotspot.withAi}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        opacity: activeTab === "with" ? 1 : 0,
                        transition: "opacity 0.3s ease",
                    }}
                />

                {/* Live status badge */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] tracking-widest font-bold text-white"
                        style={{
                            background:
                                activeTab === "with"
                                    ? `${hotspot.color}DD`
                                    : "rgba(224,82,82,0.88)",
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {activeTab === "without" ? "TRADITIONAL" : "MINISTROS AI"}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Arrow pointer */}
            <div
                className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45"
                style={{
                    background: "#FFFDF5",
                    border: `1px solid ${hotspot.color}20`,
                    borderTop: "none",
                    borderLeft: "none",
                }}
            />
        </motion.div>
    );
}

// ─── Individual Hotspot ───────────────────────────────────────────────────────
function Hotspot({
    hotspot,
    isActive,
    onActivate,
    onClose,
    onHoverChange,
}: {
    hotspot: (typeof HOTSPOTS)[number];
    isActive: boolean;
    onActivate: (id: HotspotId) => void;
    onClose: () => void;
    onHoverChange: (id: HotspotId | null) => void;
}) {
    return (
        <div
            className="absolute"
            style={{ top: hotspot.top, left: hotspot.left, transform: "translate(-50%, -50%)" }}
        >
            {/* Slow outer atmosphere glow */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 64,
                    height: 64,
                    top: "50%",
                    left: "50%",
                    translate: "-50% -50%",
                    background: `radial-gradient(circle, ${hotspot.glowColor} 0%, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Ping ring 1 */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 24, height: 24,
                    top: "50%", left: "50%",
                    translate: "-50% -50%",
                    border: `1.5px solid ${hotspot.color}`,
                }}
                animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            {/* Ping ring 2 — offset */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 24, height: 24,
                    top: "50%", left: "50%",
                    translate: "-50% -50%",
                    border: `1.5px solid ${hotspot.color}`,
                }}
                animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
            />

            {/* Core dot — no number, just a glowing orb */}
            <motion.button
                onClick={() => (isActive ? onClose() : onActivate(hotspot.id))}
                onMouseEnter={() => onHoverChange(hotspot.id)}
                onMouseLeave={() => onHoverChange(null)}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.88 }}
                className="relative w-5 h-5 rounded-full z-10 cursor-none"
                style={{
                    background: `radial-gradient(circle at 35% 35%, white 0%, ${hotspot.color} 55%)`,
                    boxShadow: isActive
                        ? `0 0 0 3px white, 0 0 0 5px ${hotspot.color}, 0 0 24px ${hotspot.color}80`
                        : `0 0 12px ${hotspot.color}80, 0 2px 8px rgba(0,0,0,0.15)`,
                    transition: "box-shadow 0.25s ease",
                }}
                aria-label={`View ${hotspot.label} scenario`}
            />

            {/* Scenario panel */}
            <AnimatePresence>
                {isActive && (
                    <ScenarioPanel hotspot={hotspot} onClose={onClose} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Main Hero Section ────────────────────────────────────────────────────────
export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
    const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId | null>(null);
    const [videoReady, setVideoReady] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    // Track mouse for custom cursor tooltip
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Apply cursor:none on section when near a hotspot
    useEffect(() => {
        if (!sectionRef.current) return;
        sectionRef.current.style.cursor = hoveredHotspot ? "none" : "";
    }, [hoveredHotspot]);

    const handleActivate = useCallback((id: HotspotId) => {
        setActiveHotspot(id);
    }, []);

    const handleClose = useCallback(() => {
        setActiveHotspot(null);
    }, []);

    const hoveredData = HOTSPOTS.find((h) => h.id === hoveredHotspot);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden"
            onClick={() => activeHotspot && handleClose()}
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

            {/* ── Hotspot Layer ─────────────────────────────────────────── */}
            <div className="absolute inset-0 z-20">
                {HOTSPOTS.map((h) => (
                    <Hotspot
                        key={h.id}
                        hotspot={h}
                        isActive={activeHotspot === h.id}
                        onActivate={handleActivate}
                        onClose={handleClose}
                        onHoverChange={setHoveredHotspot}
                    />
                ))}
            </div>

            {/* ── Custom cursor tooltip ─────────────────────────────────── */}
            <AnimatePresence>
                {hoveredData && (
                    <CursorTooltip
                        label={hoveredData.label}
                        color={hoveredData.color}
                        mouseX={mouse.x}
                        mouseY={mouse.y}
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8923C] animate-pulse" />
                <span className="text-[9px] tracking-[0.3em] text-[#8B7355] uppercase">
                    Click glowing spots to explore scenarios
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8923C] animate-pulse" />
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
        </section>
    );
}

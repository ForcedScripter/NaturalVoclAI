"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Scenario {
    id: string;
    label: string;
    emoji: string;
    description: string;
    withoutAi: string;
    withAi: string;
}

interface ScenarioTheaterProps {
    scenarios: Scenario[];
    activeId: string | null;
    onClose: () => void;
    onNavigate: (id: string) => void;
}

// ─── Draggable Comparison Slider ───────────────────────────────────────────────
function ComparisonSlider({
    withoutSrc,
    withSrc,
    label,
}: {
    withoutSrc: string;
    withSrc: string;
    label: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const withoutRef = useRef<HTMLVideoElement>(null);
    const withRef = useRef<HTMLVideoElement>(null);

    // Auto-play both videos
    useEffect(() => {
        const playVideos = () => {
            withoutRef.current?.play().catch(() => {});
            withRef.current?.play().catch(() => {});
        };
        // Small delay to ensure DOM is ready
        const timer = setTimeout(playVideos, 200);
        return () => clearTimeout(timer);
    }, [withoutSrc, withSrc]);

    const updatePosition = useCallback(
        (clientX: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
            setSliderPos(pct);
        },
        []
    );

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            setIsDragging(true);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            updatePosition(e.clientX);
        },
        [updatePosition]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        },
        [isDragging, updatePosition]
    );

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full select-none overflow-hidden rounded-2xl"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "col-resize" }}
        >
            {/* Base layer: WITHOUT AI (fit inside frame) */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1410]">
                <video
                    ref={withoutRef}
                    src={withoutSrc}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                    // @ts-expect-error -- fetchPriority is valid on video in modern browsers
                    fetchPriority="high"
                />
                {/* Red tint overlay for "without" side */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
            </div>

            {/* Overlay layer: WITH AI (clipped) */}
            <div
                className="absolute inset-0 flex items-center justify-center bg-[#141a10]"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
                <video
                    ref={withRef}
                    src={withSrc}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                    // @ts-expect-error -- fetchPriority is valid on video in modern browsers
                    fetchPriority="high"
                />
                {/* Green tint overlay for "with" side */}
                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900/10 to-transparent pointer-events-none" />
            </div>

            {/* ── Slider Handle ── */}
            <div
                className="absolute top-0 bottom-0 z-20"
                style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
                {/* Vertical line */}
                <div
                    className="absolute top-0 bottom-0 w-[2px] left-1/2 -translate-x-1/2"
                    style={{
                        background: "linear-gradient(to bottom, transparent, rgba(255,253,245,0.9) 15%, rgba(255,253,245,0.9) 85%, transparent)",
                        boxShadow: "0 0 12px 2px rgba(200,146,60,0.3)",
                    }}
                />
                {/* Handle knob */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                        background: "rgba(255,253,245,0.95)",
                        border: "2px solid rgba(200,146,60,0.5)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25), 0 0 30px rgba(200,146,60,0.15)",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5 3L2 8L5 13" stroke="#C8923C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11 3L14 8L11 13" stroke="#C8923C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* ── Side Labels ── */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{
                    background: "rgba(224,82,82,0.85)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 16px rgba(224,82,82,0.3)",
                }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] tracking-[0.15em] font-bold text-white uppercase">
                    Without AI
                </span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{
                    background: "rgba(200,146,60,0.88)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 16px rgba(200,146,60,0.3)",
                }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] tracking-[0.15em] font-bold text-white uppercase">
                    Ministros AI
                </span>
            </motion.div>

            {/* ── Drag hint (fades after a moment) ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                    background: "rgba(255,253,245,0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(200,146,60,0.2)",
                }}
            >
                <motion.div
                    animate={{ x: [-6, 6, -6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M5 3L2 8L5 13" stroke="#C8923C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11 3L14 8L11 13" stroke="#C8923C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
                <span className="text-[9px] tracking-[0.2em] text-[#8B7355] uppercase font-medium">
                    Drag to compare
                </span>
            </motion.div>
        </div>
    );
}

// ─── Main Theater Component ────────────────────────────────────────────────────
export default function ScenarioTheater({
    scenarios,
    activeId,
    onClose,
    onNavigate,
}: ScenarioTheaterProps) {
    const activeScenario = useMemo(
        () => scenarios.find((s) => s.id === activeId) ?? null,
        [scenarios, activeId]
    );

    // Close on Escape
    useEffect(() => {
        if (!activeId) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [activeId, onClose]);

    // Lock scroll when open
    useEffect(() => {
        if (activeId) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [activeId]);

    return (
        <AnimatePresence>
            {activeId && activeScenario && (
                <motion.div
                    key="scenario-theater"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="fixed inset-0 z-[200] flex flex-col"
                    onClick={onClose}
                >
                    {/* ── Backdrop ── */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: "radial-gradient(ellipse at center, rgba(61,46,26,0.75) 0%, rgba(30,22,12,0.92) 100%)",
                            backdropFilter: "blur(16px)",
                        }}
                    />

                    {/* ── Content ── */}
                    <motion.div
                        initial={{ y: 60, opacity: 0, scale: 0.92 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 60, opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-6 md:px-8 md:py-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ── Top Bar: Title + Close ── */}
                        <div className="w-full max-w-6xl flex items-center justify-between mb-4 md:mb-6">
                            {/* Scenario info */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="flex items-center gap-3"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                    style={{
                                        background: "rgba(200,146,60,0.15)",
                                        border: "1px solid rgba(200,146,60,0.25)",
                                        boxShadow: "0 4px 16px rgba(200,146,60,0.1)",
                                    }}
                                >
                                    {activeScenario.emoji}
                                </div>
                                <div>
                                    <h3 className="text-white text-sm md:text-base tracking-[0.15em] font-semibold uppercase">
                                        {activeScenario.label}
                                    </h3>
                                    <p className="text-white/50 text-[10px] md:text-xs tracking-wider max-w-md">
                                        {activeScenario.description}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Close button */}
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                                onClick={onClose}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    backdropFilter: "blur(8px)",
                                }}
                                aria-label="Close scenario theater"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* ── Video Comparison Area ── */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-6xl flex-1 min-h-0 max-h-[min(72vh,820px)] rounded-2xl overflow-hidden bg-[#1a1410]"
                            style={{
                                boxShadow: "0 32px 100px rgba(0,0,0,0.4), 0 0 60px rgba(200,146,60,0.08)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                aspectRatio: "16 / 9",
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeScenario.id}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full min-h-0"
                                >
                                    <ComparisonSlider
                                        withoutSrc={activeScenario.withoutAi}
                                        withSrc={activeScenario.withAi}
                                        label={activeScenario.label}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* ── Bottom Navigation Dots ── */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="flex items-center gap-3 mt-4 md:mt-6"
                        >
                            {scenarios.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => onNavigate(s.id)}
                                    className="group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300"
                                    style={{
                                        background:
                                            s.id === activeId
                                                ? "rgba(200,146,60,0.2)"
                                                : "rgba(255,255,255,0.05)",
                                        border: `1px solid ${s.id === activeId ? "rgba(200,146,60,0.4)" : "rgba(255,255,255,0.08)"}`,
                                    }}
                                    aria-label={`View ${s.label} scenario`}
                                >
                                    <span className="text-sm">{s.emoji}</span>
                                    <span
                                        className="text-[10px] tracking-[0.12em] uppercase font-medium transition-colors duration-300"
                                        style={{
                                            color: s.id === activeId ? "#DEB664" : "rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        {s.label}
                                    </span>
                                    {s.id === activeId && (
                                        <motion.div
                                            layoutId="activeScenarioDot"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#DEB664]"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>

                        {/* ── Keyboard hint ── */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="text-[9px] tracking-[0.25em] text-white/25 uppercase mt-2"
                        >
                            Press ESC to close
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

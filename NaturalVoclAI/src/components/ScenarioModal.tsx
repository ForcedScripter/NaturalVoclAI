"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ScenarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    scenario: {
        id: string;
        title: string;
        subtitle: string;
        withoutAi: string;
        withAi: string;
    } | null;
}

export default function ScenarioModal({ isOpen, onClose, scenario }: ScenarioModalProps) {
    const [phase, setPhase] = useState<"without" | "transitioning" | "with">("without");
    const [progress, setProgress] = useState(0);
    const animFrameRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const transitionDuration = 3000; // 3 seconds for the wipe transition

    // Reset and auto-play when modal opens
    useEffect(() => {
        if (!isOpen || !scenario) {
            setPhase("without");
            setProgress(0);
            return;
        }

        // Start with "without" for 1.5s, then auto-transition
        const showTimer = setTimeout(() => {
            setPhase("transitioning");
            startTimeRef.current = performance.now();

            const animate = (now: number) => {
                const elapsed = now - startTimeRef.current;
                const p = Math.min(elapsed / transitionDuration, 1);
                // Ease in-out
                const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
                setProgress(eased);

                if (p < 1) {
                    animFrameRef.current = requestAnimationFrame(animate);
                } else {
                    setPhase("with");
                }
            };

            animFrameRef.current = requestAnimationFrame(animate);
        }, 1500);

        return () => {
            clearTimeout(showTimer);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [isOpen, scenario]);

    // Loop: after reaching "with", wait 2s then go back to "without" and repeat
    useEffect(() => {
        if (phase !== "with" || !isOpen) return;

        const loopTimer = setTimeout(() => {
            setPhase("without");
            setProgress(0);

            // After showing "without" for 1.5s, transition again
            const restartTimer = setTimeout(() => {
                setPhase("transitioning");
                startTimeRef.current = performance.now();

                const animate = (now: number) => {
                    const elapsed = now - startTimeRef.current;
                    const p = Math.min(elapsed / transitionDuration, 1);
                    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
                    setProgress(eased);

                    if (p < 1) {
                        animFrameRef.current = requestAnimationFrame(animate);
                    } else {
                        setPhase("with");
                    }
                };

                animFrameRef.current = requestAnimationFrame(animate);
            }, 1500);

            return () => clearTimeout(restartTimer);
        }, 2500);

        return () => clearTimeout(loopTimer);
    }, [phase, isOpen]);

    if (!scenario) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-[#3D2E1A]/60 backdrop-blur-md" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.85, y: 60, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.85, y: 60, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-[95vw] max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden bg-[#FFFDF5] shadow-2xl shadow-[#C8923C]/20 border border-[#C8923C]/20"
                    >
                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#C8923C] to-[#DEB664]">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                                    {scenario.title}
                                </h3>
                                <p className="text-white/80 text-sm tracking-wider">
                                    {scenario.subtitle}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300"
                                aria-label="Close scenario"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Phase indicator */}
                        <div className="flex items-center justify-center gap-6 py-3 bg-[#FFF5DC]">
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-500 ${phase === "without" ? "bg-red-100 text-red-700 scale-110" : "bg-red-50 text-red-400 scale-100"
                                }`}>
                                <span className="w-2 h-2 rounded-full bg-red-500" style={{ opacity: phase === "without" ? 1 : 0.4 }} />
                                WITHOUT AI
                            </div>

                            {/* Progress bar */}
                            <div className="w-32 md:w-48 h-1.5 rounded-full bg-[#DEB664]/30 overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-red-400 via-[#C8923C] to-green-500"
                                    style={{ width: `${progress * 100}%` }}
                                />
                            </div>

                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-500 ${phase === "with" ? "bg-green-100 text-green-700 scale-110" : "bg-green-50 text-green-400 scale-100"
                                }`}>
                                <span className="w-2 h-2 rounded-full bg-green-500" style={{ opacity: phase === "with" ? 1 : 0.4 }} />
                                WITH MINISTROS AI
                            </div>
                        </div>

                        {/* Image Comparison Area */}
                        <div className="relative w-full overflow-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
                            {/* Without AI (base layer) */}
                            <img
                                src={scenario.withoutAi}
                                alt={`${scenario.title} - Without AI`}
                                className="w-full h-auto block"
                                draggable={false}
                                loading="eager"
                                fetchPriority="high"
                            />

                            {/* With AI (overlay with clip/reveal) */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
                                    transition: phase === "transitioning" ? "none" : "clip-path 0.5s ease",
                                }}
                            >
                                <img
                                    src={scenario.withAi}
                                    alt={`${scenario.title} - With Ministros AI`}
                                    className="w-full h-auto block"
                                    draggable={false}
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>

                            {/* Wipe Line */}
                            {phase === "transitioning" && (
                                <div
                                    className="absolute top-0 bottom-0 w-1 z-10"
                                    style={{
                                        left: `${progress * 100}%`,
                                        background: "linear-gradient(to bottom, transparent, #C8923C, transparent)",
                                        boxShadow: "0 0 20px 4px rgba(200,146,60,0.5)",
                                    }}
                                />
                            )}

                            {/* Label overlays */}
                            <AnimatePresence>
                                {phase === "without" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute bottom-6 left-6 px-5 py-3 rounded-2xl bg-red-600/90 backdrop-blur-sm text-white font-bold text-sm tracking-wider shadow-xl"
                                    >
                                        ❌ Traditional Customer Experience
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {phase === "with" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute bottom-6 right-6 px-5 py-3 rounded-2xl bg-green-600/90 backdrop-blur-sm text-white font-bold text-sm tracking-wider shadow-xl"
                                    >
                                        ✅ Powered by Ministros AI
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

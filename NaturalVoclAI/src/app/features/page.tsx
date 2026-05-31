"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useInView,
    AnimatePresence,
} from "framer-motion";
import {
    Zap,
    Clock,
    Mic2,
    Heart,
    MessageSquareOff,
    Route,
    Plug,
    Globe2,
    ArrowUpRight,
    ChevronDown,
} from "lucide-react";

type Feature = {
    id: string;
    index: string;
    title: string;
    headline: string;
    description: string;
    stat?: string;
    statLabel?: string;
    icon: typeof Zap;
    gradient: string;
    glow: string;
    accent: string;
};

const FEATURES: Feature[] = [
    {
        id: "latency",
        index: "01",
        title: "Low Latency Voice Agent",
        headline: "Sub-700ms response time",
        description:
            "Every millisecond matters in conversation. Our optimized speech-to-speech pipeline delivers responses in under 700ms — fast enough that callers never feel the lag between thought and reply.",
        stat: "<700",
        statLabel: "milliseconds",
        icon: Zap,
        gradient: "from-[#C8923C]/25 via-[#DEB664]/10 to-transparent",
        glow: "rgba(200,146,60,0.4)",
        accent: "#C8923C",
    },
    {
        id: "support",
        index: "02",
        title: "24/7 Support",
        headline: "Always on. Always ready.",
        description:
            "Your customers don't clock out — neither should your support. MINISTROS handles inbound calls around the clock, across time zones, without queues, burnout, or shift handoffs.",
        stat: "24/7",
        statLabel: "availability",
        icon: Clock,
        gradient: "from-[#A87530]/20 via-[#C8923C]/8 to-transparent",
        glow: "rgba(168,117,48,0.35)",
        accent: "#A87530",
    },
    {
        id: "voices",
        index: "03",
        title: "Voice Selection",
        headline: "Male & female voices",
        description:
            "Choose the voice that fits your brand. Switch between natural male and female voice models — each tuned for clarity, warmth, and professional tone.",
        icon: Mic2,
        gradient: "from-[#DEB664]/25 via-[#FFF5DC]/20 to-transparent",
        glow: "rgba(222,182,100,0.35)",
        accent: "#DEB664",
    },
    {
        id: "empathy",
        index: "04",
        title: "Human-Like & Emotionally Aware",
        headline: "Speaks with empathy",
        description:
            "Beyond scripted replies — our agents read tone, pace, and context to respond with genuine warmth. Frustrated caller? Calm reassurance. Happy customer? Match their energy.",
        icon: Heart,
        gradient: "from-[#D9734A]/15 via-[#C8923C]/10 to-transparent",
        glow: "rgba(217,115,74,0.3)",
        accent: "#D9734A",
    },
    {
        id: "interruptions",
        index: "05",
        title: "Interruption Handling",
        headline: "Hassle-free barge-in",
        description:
            "Real conversations aren't linear. When users interrupt, the agent stops gracefully, listens, and pivots — no awkward overlaps, no repeated phrases, no robotic restarts.",
        icon: MessageSquareOff,
        gradient: "from-[#5E8B7E]/15 via-[#C8923C]/8 to-transparent",
        glow: "rgba(94,139,126,0.3)",
        accent: "#5E8B7E",
    },
    {
        id: "resolution",
        index: "06",
        title: "End-to-End Resolution",
        headline: "From hello to resolved",
        description:
            "Not just answers — outcomes. MINISTROS handles the full journey: understand the issue, pull context, take action, confirm resolution, and close the loop without human handoff.",
        icon: Route,
        gradient: "from-[#C8923C]/20 via-[#3D2E1A]/5 to-transparent",
        glow: "rgba(200,146,60,0.35)",
        accent: "#C8923C",
    },
    {
        id: "integrations",
        index: "07",
        title: "Third-Party Integrations",
        headline: "WhatsApp, Gmail & beyond",
        description:
            "Connect to the tools your business already runs on. Trigger workflows, send confirmations, sync tickets, and bridge voice with messaging channels seamlessly.",
        icon: Plug,
        gradient: "from-[#A87530]/18 via-[#DEB664]/12 to-transparent",
        glow: "rgba(168,117,48,0.3)",
        accent: "#A87530",
    },
    {
        id: "multilingual",
        index: "08",
        title: "Multilingual Support",
        headline: "One agent, many languages",
        description:
            "Serve global customers in their native tongue. Real-time multilingual conversations without scaling your team — from English and Hindi to Spanish, Arabic, and more.",
        icon: Globe2,
        gradient: "from-[#DEB664]/22 via-[#C8923C]/10 to-transparent",
        glow: "rgba(222,182,100,0.35)",
        accent: "#DEB664",
    },
];

const INTEGRATIONS = [
    { name: "WhatsApp", color: "#25D366" },
    { name: "Gmail", color: "#EA4335" },
    { name: "Slack", color: "#4A154B" },
    { name: "Salesforce", color: "#00A1E0" },
    { name: "Zendesk", color: "#03363D" },
    { name: "HubSpot", color: "#FF7A59" },
];

const LANGUAGES = ["English", "Hindi", "Spanish", "Arabic", "French", "Tamil", "German", "Japanese"];

function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C8923C] via-[#DEB664] to-[#C8923C] origin-left z-[60]"
            style={{ scaleX }}
        />
    );
}

function FloatingOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                className="absolute -top-32 -left-32 w-[50vw] h-[50vw] rounded-full bg-[#C8923C]/8 blur-[120px]"
                animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/2 -right-24 w-[45vw] h-[45vw] rounded-full bg-[#DEB664]/10 blur-[100px]"
                animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

function LatencyVisual({ accent }: { accent: string }) {
    const [ms, setMs] = useState(1200);

    useEffect(() => {
        const targets = [1200, 980, 820, 690, 650];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % targets.length;
            setMs(targets[i]);
        }, 1400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full aspect-square max-w-[280px] mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="88" fill="none" stroke={`${accent}22`} strokeWidth="1" />
                <motion.circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke={accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="553"
                    animate={{ strokeDashoffset: ms < 700 ? 80 : 200 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    transform="rotate(-90 100 100)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={ms}
                        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                        className="text-4xl md:text-5xl font-light tabular-nums"
                        style={{ color: ms < 700 ? accent : "#8B7355" }}
                    >
                        {ms}
                        <span className="text-lg ml-1 text-[#8B7355]">ms</span>
                    </motion.span>
                </AnimatePresence>
                <motion.p
                    animate={{ opacity: ms < 700 ? 1 : 0.4 }}
                    className="text-[10px] tracking-[0.25em] uppercase mt-2"
                    style={{ color: accent }}
                >
                    {ms < 700 ? "Target hit" : "Optimizing…"}
                </motion.p>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-[3px]">
                {[...Array(16)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-[3px] rounded-full"
                        style={{ background: accent }}
                        animate={{
                            height: ms < 700 ? [6, 18 + (i % 4) * 4, 6] : [4, 8, 4],
                            opacity: ms < 700 ? 0.8 : 0.3,
                        }}
                        transition={{
                            duration: 0.6 + (i % 3) * 0.1,
                            repeat: Infinity,
                            delay: i * 0.04,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function AlwaysOnVisual({ accent }: { accent: string }) {
    return (
        <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center">
            {[0, 1, 2].map((ring) => (
                <motion.div
                    key={ring}
                    className="absolute rounded-full border"
                    style={{ borderColor: `${accent}${ring === 0 ? "55" : ring === 1 ? "33" : "18"}` }}
                    animate={{ scale: [1, 1.35 + ring * 0.15], opacity: [0.6, 0] }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: ring * 0.7,
                        ease: "easeOut",
                    }}
                    initial={{ width: 80, height: 80 }}
                />
            ))}
            <div
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: `${accent}18`, border: `1px solid ${accent}44` }}
            >
                <Clock className="w-8 h-8" style={{ color: accent }} />
            </div>
            <div className="absolute bottom-6 flex gap-6 text-[10px] tracking-widest uppercase text-[#8B7355]">
                {["Mon", "Wed", "Fri", "Sun"].map((d, i) => (
                    <motion.span
                        key={d}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        style={{ color: i % 2 === 0 ? accent : undefined }}
                    >
                        {d}
                    </motion.span>
                ))}
            </div>
        </div>
    );
}

function VoiceSelectVisual({ accent }: { accent: string }) {
    const [active, setActive] = useState<"male" | "female">("female");

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((p) => (p === "female" ? "male" : "female"));
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-[280px] mx-auto space-y-6">
            <div className="flex rounded-2xl border border-[#C8923C]/15 p-1 bg-[#FFFDF5]/60">
                {(["female", "male"] as const).map((v) => (
                    <button
                        key={v}
                        type="button"
                        onClick={() => setActive(v)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
                            active === v
                                ? "text-[#3D2E1A] shadow-sm"
                                : "text-[#8B7355] hover:text-[#3D2E1A]"
                        }`}
                        style={
                            active === v
                                ? { background: `${accent}22`, border: `1px solid ${accent}44` }
                                : undefined
                        }
                    >
                        {v}
                    </button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-end justify-center gap-[3px] h-24"
                >
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-[4px] rounded-full"
                            style={{
                                background: `linear-gradient(to top, ${accent}66, ${accent})`,
                            }}
                            animate={{
                                height:
                                    active === "female"
                                        ? [8, 16 + Math.sin(i * 0.5) * 24, 8]
                                        : [10, 12 + Math.cos(i * 0.6) * 18, 10],
                            }}
                            transition={{
                                duration: active === "female" ? 0.9 : 1.1,
                                repeat: Infinity,
                                delay: i * 0.04,
                            }}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function EmpathyVisual({ accent }: { accent: string }) {
    const moods = [
        { label: "Frustrated", bars: [40, 60, 35, 55], color: "#D9734A" },
        { label: "Calm reply", bars: [20, 30, 25, 28], color: accent },
    ];

    return (
        <div className="relative w-full max-w-[280px] mx-auto space-y-5">
            {moods.map((mood, mi) => (
                <motion.div
                    key={mood.label}
                    initial={{ opacity: 0, x: mi === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: mi * 0.2 }}
                    className="p-4 rounded-2xl border border-[#C8923C]/12 bg-[#FFFDF5]/50"
                >
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#8B7355] mb-3">
                        {mood.label}
                    </p>
                    <div className="flex items-end gap-1 h-10">
                        {mood.bars.map((h, i) => (
                            <motion.div
                                key={i}
                                className="flex-1 rounded-full"
                                style={{ background: mood.color }}
                                animate={{ height: [h * 0.5, h, h * 0.5] }}
                                transition={{
                                    duration: 1.2 + i * 0.1,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            ))}
            <motion.div
                className="flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase"
                style={{ color: accent }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <Heart className="w-3 h-3 fill-current" />
                Tone-aware response
            </motion.div>
        </div>
    );
}

function InterruptionVisual({ accent }: { accent: string }) {
    const [interrupted, setInterrupted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setInterrupted(true);
            setTimeout(() => setInterrupted(false), 1200);
        }, 3200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-[280px] mx-auto p-5 rounded-2xl border border-[#C8923C]/12 bg-[#FFFDF5]/50">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#5E8B7E]" />
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#8B7355]">Live conversation</p>
            </div>
            <div className="space-y-3">
                <div className="flex justify-end">
                    <div className="px-3 py-2 rounded-2xl rounded-tr-sm bg-[#C8923C]/15 text-[11px] text-[#3D2E1A] max-w-[85%]">
                        Actually, I need to change my address instead—
                    </div>
                </div>
                <motion.div
                    className="flex items-end gap-[2px] h-8 px-2"
                    animate={{ opacity: interrupted ? 0.3 : 1 }}
                >
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-[3px] rounded-full bg-[#8B7355]"
                            animate={{ height: interrupted ? 4 : [6, 14 + (i % 3) * 4, 6] }}
                            transition={{ duration: 0.5, repeat: interrupted ? 0 : Infinity, delay: i * 0.05 }}
                        />
                    ))}
                </motion.div>
                <AnimatePresence>
                    {interrupted && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="px-3 py-2 rounded-2xl rounded-tl-sm text-[11px] text-[#3D2E1A] max-w-[90%]"
                            style={{ background: `${accent}18`, border: `1px solid ${accent}33` }}
                        >
                            Of course — let&apos;s update your address right away.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ResolutionVisual({ accent }: { accent: string }) {
    const steps = ["Listen", "Understand", "Act", "Resolve"];

    return (
        <div className="relative w-full max-w-[280px] mx-auto">
            <div className="flex flex-col gap-0">
                {steps.map((step, i) => (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-center gap-3"
                    >
                        <div className="flex flex-col items-center">
                            <motion.div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-[#3D2E1A]"
                                style={{ background: `${accent}${20 + i * 15}`, border: `1px solid ${accent}44` }}
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                            >
                                {i + 1}
                            </motion.div>
                            {i < steps.length - 1 && (
                                <div className="w-[1px] h-6 bg-gradient-to-b from-[#C8923C]/40 to-transparent" />
                            )}
                        </div>
                        <p className="text-sm tracking-wide text-[#3D2E1A] pb-6">{step}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div
                className="absolute -right-2 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.2em] uppercase px-2 py-1 rounded-full"
                style={{ background: `${accent}22`, color: accent }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Done
            </motion.div>
        </div>
    );
}

function IntegrationsVisual() {
    return (
        <div className="relative w-full max-w-[300px] mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 rounded-2xl border border-[#C8923C]/25 bg-[#FFFDF5]/80 flex items-center justify-center"
                    animate={{ boxShadow: ["0 0 0 0 rgba(200,146,60,0)", "0 0 30px 8px rgba(200,146,60,0.15)", "0 0 0 0 rgba(200,146,60,0)"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Plug className="w-7 h-7 text-[#C8923C]" />
                </motion.div>
            </div>
            {INTEGRATIONS.map((item, i) => {
                const angle = (i / INTEGRATIONS.length) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 110;
                const y = Math.sin(angle) * 90;

                return (
                    <motion.div
                        key={item.name}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ x, y }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, type: "spring" }}
                    >
                        <motion.div
                            className="px-3 py-1.5 rounded-full text-[10px] tracking-wider font-medium text-white shadow-lg"
                            style={{ background: item.color }}
                            whileHover={{ scale: 1.08 }}
                        >
                            {item.name}
                        </motion.div>
                        <svg
                            className="absolute left-1/2 top-1/2 -z-10 pointer-events-none"
                            width="120"
                            height="120"
                            style={{
                                transform: `translate(calc(-50% - ${x}px), calc(-50% - ${y}px))`,
                            }}
                        >
                            <motion.line
                                x1={60 + x * 0.5}
                                y1={60 + y * 0.5}
                                x2={60}
                                y2={60}
                                stroke="#C8923C"
                                strokeOpacity="0.2"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            />
                        </svg>
                    </motion.div>
                );
            })}
        </div>
    );
}

function MultilingualVisual({ accent }: { accent: string }) {
    return (
        <div className="relative w-full max-w-[280px] mx-auto aspect-square flex items-center justify-center">
            <motion.div
                className="absolute w-32 h-32 rounded-full border border-dashed"
                style={{ borderColor: `${accent}33` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <Globe2 className="w-12 h-12 relative z-10" style={{ color: accent }} />
            {LANGUAGES.map((lang, i) => {
                const angle = (i / LANGUAGES.length) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 100;
                const y = Math.sin(angle) * 100;

                return (
                    <motion.span
                        key={lang}
                        className="absolute text-[9px] tracking-wider px-2 py-1 rounded-full border bg-[#FFFDF5]/90 text-[#3D2E1A]"
                        style={{
                            borderColor: `${accent}33`,
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%)",
                        }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
                    >
                        {lang}
                    </motion.span>
                );
            })}
        </div>
    );
}

function FeatureVisual({ feature }: { feature: Feature }) {
    switch (feature.id) {
        case "latency":
            return <LatencyVisual accent={feature.accent} />;
        case "support":
            return <AlwaysOnVisual accent={feature.accent} />;
        case "voices":
            return <VoiceSelectVisual accent={feature.accent} />;
        case "empathy":
            return <EmpathyVisual accent={feature.accent} />;
        case "interruptions":
            return <InterruptionVisual accent={feature.accent} />;
        case "resolution":
            return <ResolutionVisual accent={feature.accent} />;
        case "integrations":
            return <IntegrationsVisual />;
        case "multilingual":
            return <MultilingualVisual accent={feature.accent} />;
        default:
            return null;
    }
}

function FeaturePanel({ feature, index }: { feature: Feature; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
    const isEven = index % 2 === 0;
    const Icon = feature.icon;

    return (
        <motion.section
            ref={ref}
            id={feature.id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative min-h-[85vh] flex items-center py-16 md:py-24"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                    background: `radial-gradient(ellipse 60% 50% at ${isEven ? "20%" : "80%"} 50%, ${feature.glow}, transparent)`,
                }}
            />

            <div
                className={`relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                    isEven ? "" : "lg:[direction:rtl]"
                }`}
            >
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className={`lg:[direction:ltr] ${isEven ? "lg:pr-8" : "lg:pl-8"}`}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <span
                            className="text-[10px] tracking-[0.35em] uppercase font-medium"
                            style={{ color: feature.accent }}
                        >
                            {feature.index}
                        </span>
                        <div className="h-[1px] flex-1 max-w-[60px] bg-gradient-to-r from-[#C8923C]/40 to-transparent" />
                        <div
                            className="p-2 rounded-xl"
                            style={{ background: `${feature.accent}15`, border: `1px solid ${feature.accent}30` }}
                        >
                            <Icon className="w-4 h-4" style={{ color: feature.accent }} />
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.06em] text-[#3D2E1A] mb-3 leading-tight">
                        {feature.title}
                    </h2>
                    <p
                        className="text-lg md:text-xl font-medium mb-5 tracking-wide"
                        style={{ color: feature.accent }}
                    >
                        {feature.headline}
                    </p>
                    <p className="text-sm md:text-base text-[#8B7355] leading-relaxed tracking-wide max-w-lg">
                        {feature.description}
                    </p>

                    {feature.stat && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="mt-8 inline-flex items-baseline gap-2 px-4 py-2 rounded-xl border border-[#C8923C]/15 bg-[#FFFDF5]/60"
                        >
                            <span
                                className="text-2xl md:text-3xl font-bold"
                                style={{ color: feature.accent }}
                            >
                                {feature.stat}
                            </span>
                            {feature.statLabel && (
                                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8B7355]">
                                    {feature.statLabel}
                                </span>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`lg:[direction:ltr] relative p-6 md:p-10 rounded-3xl border border-[#C8923C]/12 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm overflow-hidden`}
                >
                    <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle at 30% 20%, ${feature.glow}, transparent 60%)`,
                        }}
                    />
                    <div className="relative z-10">
                        <FeatureVisual feature={feature} />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}

function FeatureNav({ activeId }: { activeId: string }) {
    return (
        <nav className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
            {FEATURES.map((f) => (
                <a
                    key={f.id}
                    href={`#${f.id}`}
                    className={`group flex items-center gap-2 transition-all duration-300 ${
                        activeId === f.id ? "opacity-100" : "opacity-35 hover:opacity-70"
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            activeId === f.id ? "scale-150" : "scale-100"
                        }`}
                        style={{ background: activeId === f.id ? f.accent : "#8B7355" }}
                    />
                    <span className="text-[9px] tracking-[0.15em] uppercase text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity max-w-[80px] truncate">
                        {f.title.split(" ")[0]}
                    </span>
                </a>
            ))}
        </nav>
    );
}

export default function FeaturesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState(FEATURES[0].id);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -80]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        FEATURES.forEach((f) => {
            const el = document.getElementById(f.id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveId(f.id);
                },
                { rootMargin: "-40% 0px -40% 0px" }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#FFFDF5] text-[#3D2E1A] overflow-x-hidden">
            <ScrollProgress />
            <FloatingOrbs />
            <FeatureNav activeId={activeId} />

            {/* Hero */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16">
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 text-center max-w-4xl mx-auto"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-brand-gold text-[10px] md:text-xs tracking-[0.35em] uppercase mb-6"
                    >
                        Platform Capabilities
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.12em] uppercase leading-[1.1] mb-6"
                    >
                        Built for{" "}
                        <span className="block sm:inline font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8923C] via-[#DEB664] to-[#C8923C] bg-[length:200%_auto] animate-[shimmer_4s_ease-in-out_infinite]">
                            Real Conversations
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-[#8B7355] text-sm md:text-base tracking-wide max-w-xl mx-auto leading-relaxed mb-12"
                    >
                        Eight capabilities that make MINISTROS feel less like software — and more like your best support agent.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-16"
                    >
                        {FEATURES.map((f, i) => (
                            <motion.a
                                key={f.id}
                                href={`#${f.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                whileHover={{ y: -2, borderColor: `${f.accent}66` }}
                                className="px-3 py-1.5 rounded-full border border-[#C8923C]/15 bg-[#FFFDF5]/70 text-[10px] tracking-[0.15em] uppercase text-[#8B7355] hover:text-[#3D2E1A] transition-colors backdrop-blur-sm"
                            >
                                {f.title}
                            </motion.a>
                        ))}
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-[#8B7355]"
                    >
                        <span className="text-[10px] tracking-[0.3em] uppercase">Explore</span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </motion.div>
                </motion.div>

                {/* Ambient waveform ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full border border-[#C8923C]/10"
                            style={{ width: 280 + i * 120, height: 280 + i * 120 }}
                            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
                            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}
                </div>
            </section>

            {/* Feature panels */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
                {FEATURES.map((feature, i) => (
                    <FeaturePanel key={feature.id} feature={feature} index={i} />
                ))}
            </div>

            {/* CTA */}
            <section className="relative z-10 py-24 md:py-32 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center p-10 md:p-16 rounded-3xl border border-[#C8923C]/15 bg-gradient-to-br from-[#C8923C]/[0.08] to-[#FFFDF5] backdrop-blur-sm relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,146,60,0.12),transparent_70%)] pointer-events-none" />
                    <p className="text-[10px] tracking-[0.3em] uppercase text-brand-gold mb-4 relative z-10">
                        Ready to experience it?
                    </p>
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] uppercase mb-4 relative z-10">
                        Hear the difference{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8923C] to-[#DEB664]">
                            yourself
                        </span>
                    </h2>
                    <p className="text-sm text-[#8B7355] tracking-wide mb-8 max-w-md mx-auto relative z-10">
                        Try live voice scenarios on the homepage or join our community to shape what we build next.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 relative z-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gold text-[#3D2E1A] text-xs tracking-[0.2em] uppercase font-medium hover:bg-brand-gold/90 transition-colors"
                        >
                            Try Demo
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/community"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#C8923C]/25 text-[#3D2E1A] text-xs tracking-[0.2em] uppercase hover:border-brand-gold/40 transition-colors"
                        >
                            Join Community
                        </Link>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

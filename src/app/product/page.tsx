"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const ZOOM_MS = 600;

type Product = {
    id: string;
    emoji: string;
    name: string;
    cite: string;
    badge: string;
    description: string;
    subtitle: string;
    features: [string, string, string];
    bg: string;
    accent: string;
    badgeBg: string;
    pillBorder: string;
};

const PRODUCTS: Product[] = [
    {
        id: "soberano",
        emoji: "👑",
        name: "Ministros Soberano",
        cite: "Sovereign, ruler of the kingdom",
        badge: "Full Agentic Platform",
        subtitle: "Unified enterprise orchestration",
        description:
            "A self-contained, unified ecosystem where AI agents govern, orchestrate, and optimize every aspect of your enterprise operations with autonomous authority.",
        features: ["Autonomous governance", "Enterprise orchestration", "Unified agent ecosystem"],
        bg: "#FFF8EB",
        accent: "#A87530",
        badgeBg: "rgba(200,146,60,0.18)",
        pillBorder: "rgba(168,117,48,0.28)",
    },
    {
        id: "codice",
        emoji: "📚",
        name: "Ministros Códice",
        cite: "Archive / Codex of knowledge",
        badge: "RAG Knowledge System",
        subtitle: "The infallible archive",
        description:
            "The Infallible Archive. An immutable, context-aware library that enables Retrieval-Augmented Generation for every agent, ensuring absolute accuracy and consistency across your entire knowledge base.",
        features: ["Immutable knowledge base", "Context-aware RAG", "Cross-agent consistency"],
        bg: "#F2FAF4",
        accent: "#5E8B7E",
        badgeBg: "rgba(94,139,126,0.16)",
        pillBorder: "rgba(94,139,126,0.28)",
    },
    {
        id: "heraldo",
        emoji: "📣",
        name: "Ministros Heraldo",
        cite: "Royal messenger / herald",
        badge: "Voice Calling Agent",
        subtitle: "The royal messenger",
        description:
            "The Royal Messenger. An articulate, low-latency vocal agent that handles inbound and outbound calls, instantly processing information from the Códice with professional grace.",
        features: ["Inbound & outbound calls", "Sub-700ms latency", "Códice-powered responses"],
        bg: "#EFF6FF",
        accent: "#4A6FA5",
        badgeBg: "rgba(74,111,165,0.14)",
        pillBorder: "rgba(74,111,165,0.28)",
    },
    {
        id: "regente",
        emoji: "🧠",
        name: "Ministros Regente",
        cite: "Regent, one who governs and serves",
        badge: "Agentic RAG Customer Service",
        subtitle: "The elite advisors",
        description:
            "The Elite Advisors. Advanced AI agents with strategic depth and empathetic reasoning, designed to elevate customer interactions to a new level of personalized service, utilizing the Códice for all knowledge.",
        features: ["Empathetic reasoning", "Strategic depth", "Códice-backed service"],
        bg: "#FDF2F8",
        accent: "#9B5A72",
        badgeBg: "rgba(155,90,114,0.14)",
        pillBorder: "rgba(155,90,114,0.28)",
    },
];

const SECTION_IDS = ["intro", ...PRODUCTS.map((p) => p.id)];

type AnimPhase = "idle" | "enter" | "exit";

function useSectionPhase() {
    const ref = useRef<HTMLElement>(null);
    const [phase, setPhase] = useState<AnimPhase>("idle");

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.32) {
                    setPhase("enter");
                    return;
                }
                if (!entry.isIntersecting) {
                    if (entry.boundingClientRect.top < 0) {
                        setPhase("exit");
                    } else {
                        setPhase("idle");
                    }
                }
            },
            { threshold: [0, 0.2, 0.32, 0.5, 0.75], rootMargin: "-12% 0px -12% 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, phase, active: phase === "enter" };
}

function useActiveSection() {
    const [activeId, setActiveId] = useState(SECTION_IDS[0]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
                        setActiveId(id);
                    }
                },
                { threshold: [0.45, 0.55, 0.65], rootMargin: "-35% 0px -35% 0px" }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return activeId;
}

function cardTransform(phase: AnimPhase): React.CSSProperties {
    if (phase === "enter") {
        return {
            transform: "scale(1)",
            opacity: 1,
            transition: `transform ${ZOOM_MS}ms ${EASE}, opacity ${ZOOM_MS}ms ${EASE}`,
        };
    }
    if (phase === "exit") {
        return {
            transform: "scale(1.2)",
            opacity: 0,
            transition: `transform ${ZOOM_MS}ms ${EASE}, opacity ${ZOOM_MS}ms ${EASE}`,
        };
    }
    return {
        transform: "scale(0.6)",
        opacity: 0,
        transition: `transform ${ZOOM_MS}ms ${EASE}, opacity ${ZOOM_MS}ms ${EASE}`,
    };
}

function fadeStyle(visible: boolean, delayMs: number): React.CSSProperties {
    return {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 500ms ${EASE} ${delayMs}ms, transform 500ms ${EASE} ${delayMs}ms`,
    };
}

function DotNav({
    activeId,
    onNavigate,
}: {
    activeId: string;
    onNavigate: (id: string) => void;
}) {
    const labels: Record<string, string> = {
        intro: "Overview",
        ...Object.fromEntries(PRODUCTS.map((p) => [p.id, p.emoji])),
    };

    return (
        <nav
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3"
            aria-label="Section navigation"
        >
            {SECTION_IDS.map((id) => {
                const isActive = activeId === id;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onNavigate(id)}
                        aria-label={`Go to ${labels[id]}`}
                        aria-current={isActive ? "true" : undefined}
                        className="group flex items-center justify-center p-1"
                    >
                        <span
                            className="block rounded-full transition-all duration-300"
                            style={{
                                width: isActive ? 12 : 8,
                                height: isActive ? 12 : 8,
                                background: isActive ? "#3D2E1A" : "#C8923C55",
                                boxShadow: isActive ? "0 0 0 3px rgba(200,146,60,0.25)" : "none",
                            }}
                        />
                    </button>
                );
            })}
        </nav>
    );
}

function IntroSection({ onGo }: { onGo: (id: string) => void }) {
    const { ref, phase, active } = useSectionPhase();

    return (
        <section
            id="intro"
            ref={ref}
            className="snap-start snap-always relative flex min-h-screen flex-col items-center justify-center px-4 py-24"
            style={{ background: "#FFFDF5" }}
        >
            <div className="w-full max-w-4xl text-center mb-10">
                <p
                    style={fadeStyle(active, 0)}
                    className="text-[10px] tracking-[0.35em] uppercase text-[#C8923C] mb-4"
                >
                    The Ministros Suite
                </p>
                <h1
                    style={fadeStyle(active, 80)}
                    className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase text-[#3D2E1A]"
                >
                    Four products.{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8923C] to-[#DEB664]">
                        One kingdom.
                    </span>
                </h1>
            </div>

            <div
                className="grid w-full max-w-3xl grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
                style={cardTransform(active ? "enter" : phase)}
            >
                {PRODUCTS.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => onGo(p.id)}
                        className="text-left rounded-2xl border p-5 md:p-6 transition-shadow duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8923C]/40"
                        style={{
                            background: p.bg,
                            borderColor: p.pillBorder,
                        }}
                    >
                        <span className="text-4xl md:text-5xl block mb-3" aria-hidden>
                            {p.emoji}
                        </span>
                        <p
                            className="text-[9px] tracking-[0.2em] uppercase mb-1"
                            style={{ color: p.accent }}
                        >
                            {p.cite}
                        </p>
                        <h2 className="text-sm md:text-base font-bold tracking-[0.08em] uppercase text-[#3D2E1A]">
                            {p.name}
                        </h2>
                        <p className="text-xs text-[#8B7355] mt-1 tracking-wide">{p.subtitle}</p>
                    </button>
                ))}
            </div>

            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8B7355]"
                style={fadeStyle(active, 300)}
            >
                <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to explore</span>
                <span
                    className="text-lg leading-none"
                    style={{
                        animation: "productBounce 2s ease-in-out infinite",
                    }}
                >
                    ↓
                </span>
            </div>
        </section>
    );
}

function ProductSection({ product }: { product: Product }) {
    const { ref, phase, active } = useSectionPhase();
    const baseDelay = 150;

    return (
        <section
            id={product.id}
            ref={ref}
            className="snap-start snap-always relative flex min-h-screen items-center justify-center px-4 py-20"
            style={{ background: product.bg }}
        >
            <div className="flex w-full max-w-lg flex-col items-center text-center">
                <div
                    className="mb-8 flex h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-full border-2 shadow-lg"
                    style={{
                        ...cardTransform(phase),
                        borderColor: product.pillBorder,
                        background: "rgba(255,253,245,0.85)",
                        boxShadow: `0 20px 50px -12px ${product.pillBorder}`,
                    }}
                >
                    <span className="text-5xl md:text-6xl select-none" aria-hidden>
                        {product.emoji}
                    </span>
                </div>

                <p
                    style={fadeStyle(active, baseDelay)}
                    className="text-[10px] tracking-[0.28em] uppercase mb-3"
                >
                    <span style={{ color: product.accent }}>[{product.cite}]</span>
                </p>

                <h2
                    style={fadeStyle(active, baseDelay + 60)}
                    className="text-2xl md:text-4xl font-bold tracking-[0.06em] uppercase text-[#3D2E1A] mb-4 leading-tight"
                >
                    {product.name}
                </h2>

                <span
                    style={{
                        ...fadeStyle(active, baseDelay + 120),
                        background: product.badgeBg,
                        color: product.accent,
                        border: `1px solid ${product.pillBorder}`,
                    }}
                    className="inline-block px-4 py-1.5 rounded-full text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium mb-6"
                >
                    {product.badge}
                </span>

                <div style={fadeStyle(active, baseDelay + 180)} className="w-16 h-px mb-6">
                    <div
                        className="h-full w-full"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${product.accent}, transparent)`,
                        }}
                    />
                </div>

                <p
                    style={fadeStyle(active, baseDelay + 240)}
                    className="text-sm md:text-base text-[#5C4A32] leading-relaxed tracking-wide max-w-md mb-10"
                >
                    {product.description}
                </p>

                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {product.features.map((feat, i) => (
                        <span
                            key={feat}
                            style={{
                                ...fadeStyle(active, baseDelay + 300 + i * 70),
                                borderColor: product.pillBorder,
                                color: "#3D2E1A",
                            }}
                            className="px-3 py-1.5 rounded-full text-[10px] md:text-xs tracking-wider border bg-[#FFFDF5]/70"
                        >
                            {feat}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function ProductPage() {
    const scrollerRef = useRef<HTMLElement>(null);
    const activeId = useActiveSection();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <>
            <style jsx global>{`
                @keyframes productBounce {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(8px);
                    }
                }
                .product-scroll-container {
                    scroll-snap-type: y mandatory;
                    scroll-padding-top: 5rem;
                    scroll-behavior: smooth;
                    height: 100vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                .product-scroll-container::-webkit-scrollbar {
                    width: 6px;
                }
                .product-scroll-container::-webkit-scrollbar-thumb {
                    background: rgba(200, 146, 60, 0.35);
                    border-radius: 3px;
                }
            `}</style>

            <DotNav activeId={activeId} onNavigate={scrollTo} />

            <main
                ref={scrollerRef}
                className="product-scroll-container bg-[#FFFDF5] text-[#3D2E1A]"
            >
                <IntroSection onGo={scrollTo} />
                {PRODUCTS.map((product) => (
                    <ProductSection key={product.id} product={product} />
                ))}
            </main>
        </>
    );
}

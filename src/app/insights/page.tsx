"use client";

import { useRef, useState, useEffect } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useInView,
} from "framer-motion";
import Link from "next/link";
import {
    Mic,
    Building2,
    Store,
    Radio,
    ArrowUpRight,
    Quote,
    Sparkles,
    ChevronDown,
} from "lucide-react";

type InsightArticle = {
    id: string;
    index: string;
    tag: string;
    title: string;
    paragraphs: string[];
    stats?: { value: string; label: string }[];
    bullets?: string[];
    highlight?: { from: string; to: string; suffix?: string };
    quote: { text: string; author: string };
    readMoreUrl: string;
    icon: typeof Mic;
    gradient: string;
    glow: string;
};

const ARTICLES: InsightArticle[] = [
    {
        id: "voice-category",
        index: "01",
        tag: "Market Shift",
        title: "AI Voice Agents Are Becoming the Next Major Software Category",
        paragraphs: [
            "Voice AI is rapidly evolving from simple chatbots into intelligent agents capable of handling complete customer interactions — from answering queries to resolving support tickets end-to-end.",
            "According to industry reports, the global AI Voice Agent market is projected to grow from $2.5 Billion in 2025 to over $35 Billion by 2033, representing one of the fastest-growing segments in enterprise software.",
            "As businesses increasingly demand 24/7 multilingual support and faster resolution times, AI voice agents are becoming a critical part of customer operations.",
        ],
        highlight: { from: "$2.5B", to: "$35B", suffix: "2025 → 2033" },
        quote: {
            text: "Voice is the most natural interface for AI.",
            author: "Andreessen Horowitz (a16z)",
        },
        readMoreUrl: "https://a16z.com/ai-voice-agents-2025-update/",
        icon: Mic,
        gradient: "from-[#C8923C]/20 via-[#DEB664]/10 to-transparent",
        glow: "rgba(200,146,60,0.35)",
    },
    {
        id: "investment",
        index: "02",
        tag: "Enterprise",
        title: "Businesses Are Investing Heavily in AI-Powered Customer Service",
        paragraphs: [
            "Customer expectations have fundamentally changed. Modern consumers expect instant responses, personalized support, and round-the-clock availability.",
            "The global AI Customer Service market is expected to reach nearly $84 Billion by 2033, highlighting the growing shift toward intelligent automation.",
        ],
        stats: [
            { value: "80%", label: "say experience equals product quality" },
            { value: "30%", label: "cost reduction with AI support" },
            { value: "$84B", label: "market size projected by 2033" },
        ],
        bullets: [
            "80% of customers consider their experience with a company to be as important as its products.",
            "AI-powered support solutions can reduce customer service costs by up to 30%.",
            "Businesses adopting AI customer support report significant improvements in response times and customer satisfaction.",
        ],
        quote: {
            text: "AI will transform every customer interaction.",
            author: "Satya Nadella, CEO of Microsoft",
        },
        readMoreUrl:
            "https://www.grandviewresearch.com/industry-analysis/ai-customer-service-market-report",
        icon: Building2,
        gradient: "from-[#A87530]/15 via-[#C8923C]/8 to-transparent",
        glow: "rgba(168,117,48,0.3)",
    },
    {
        id: "smb-adoption",
        index: "03",
        tag: "Accessibility",
        title: "Small & Mid-Sized Businesses Are Leading the Next Wave of AI Adoption",
        paragraphs: [
            "Until recently, advanced customer support technology was accessible only to large enterprises. Today, AI is enabling small and mid-sized businesses to deliver enterprise-grade customer experiences without enterprise-level costs.",
            "This shift is creating enormous opportunities for businesses looking to improve efficiency while maintaining personalized customer engagement.",
        ],
        bullets: [
            "Over 70% of businesses using AI support solutions report improved customer satisfaction.",
            "AI-driven support systems can automate a significant portion of repetitive customer interactions.",
            "Multilingual AI agents are helping businesses expand customer reach across regions and languages without scaling support teams.",
        ],
        quote: {
            text: "The future customer service agent will be AI-assisted.",
            author: "Marc Benioff, CEO of Salesforce",
        },
        readMoreUrl: "https://www.groovehq.com/blog/55-ai-customer-support-statistics",
        icon: Store,
        gradient: "from-[#DEB664]/20 via-[#FFF5DC]/30 to-transparent",
        glow: "rgba(222,182,100,0.35)",
    },
    {
        id: "voice-first",
        index: "04",
        tag: "Future",
        title: "The Future of Customer Support Is Voice-First",
        paragraphs: [
            "Voice is emerging as the preferred interface for customer engagement because it is faster, more intuitive, and more human than traditional support channels.",
            "Market analysts project that voice-driven AI systems will become a primary channel for customer service across industries including healthcare, retail, finance, logistics, education, and local businesses.",
            "As AI reasoning, speech synthesis, and business integrations continue to improve, voice agents are expected to become the first point of contact for millions of customer interactions worldwide.",
        ],
        bullets: [
            "24/7 AI voice support availability",
            "Real-time multilingual conversations",
            "End-to-end ticket resolution automation",
            "AI-powered outbound and inbound calling assistants",
            "Reduced operational costs with higher scalability",
        ],
        quote: {
            text: "Every business process will be reimagined with AI.",
            author: "Jensen Huang, CEO of NVIDIA",
        },
        readMoreUrl:
            "https://www.grandviewresearch.com/industry-analysis/ai-voice-agents-market-report",
        icon: Radio,
        gradient: "from-[#C8923C]/25 via-[#3D2E1A]/5 to-transparent",
        glow: "rgba(200,146,60,0.4)",
    },
];

function VoiceWaveBars({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-end justify-center gap-[3px] ${className}`}>
            {[...Array(24)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-gradient-to-t from-[#C8923C]/40 to-[#DEB664]"
                    animate={{
                        height: [8, 12 + Math.abs(Math.sin(i * 0.7)) * 28, 8],
                    }}
                    transition={{
                        duration: 1.2 + (i % 5) * 0.15,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
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
                className="absolute top-1/3 -right-24 w-[45vw] h-[45vw] rounded-full bg-[#DEB664]/10 blur-[100px]"
                animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[#C8923C]/6 blur-[140px]"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

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

function MarketGrowthVisual({ from, to, suffix }: { from: string; to: string; suffix?: string }) {
    return (
        <div className="relative mt-8 p-6 md:p-8 rounded-2xl border border-[#C8923C]/15 bg-[#FFFDF5]/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8923C]/5 to-transparent pointer-events-none" />
            <p className="text-[9px] tracking-[0.3em] text-[#8B7355] uppercase mb-6">Market projection</p>
            <div className="flex items-end justify-between gap-4 relative z-10">
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-light text-[#8B7355]"
                    >
                        {from}
                    </motion.p>
                    <p className="text-[10px] tracking-widest text-[#B8A080] mt-1">2025</p>
                </div>
                <div className="flex-1 flex items-center justify-center px-2">
                    <svg viewBox="0 0 200 60" className="w-full max-w-[200px] h-12">
                        <defs>
                            <linearGradient id="growthLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#C8923C" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#DEB664" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d="M 10 50 Q 60 45 100 25 T 190 8"
                            fill="none"
                            stroke="url(#growthLine)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        {[10, 100, 190].map((x, i) => (
                            <motion.circle
                                key={x}
                                cx={x}
                                cy={i === 0 ? 50 : i === 1 ? 25 : 8}
                                r="4"
                                fill="#C8923C"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.2 }}
                            />
                        ))}
                    </svg>
                </div>
                <div className="text-right">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8923C] to-[#DEB664]"
                    >
                        {to}
                    </motion.p>
                    <p className="text-[10px] tracking-widest text-brand-gold mt-1">{suffix || "2033"}</p>
                </div>
            </div>
        </div>
    );
}

function StatValue({ value }: { value: string }) {
    if (value.endsWith("%")) {
        return (
            <span className="inline-flex items-baseline justify-center gap-px leading-none">
                <span className="text-2xl md:text-3xl font-bold text-[#C8923C]">
                    {value.slice(0, -1)}
                </span>
                <span className="text-xl md:text-2xl font-bold text-[#DEB664]">%</span>
            </span>
        );
    }

    return (
        <span className="text-2xl md:text-3xl font-bold text-[#C8923C] leading-none">
            {value}
        </span>
    );
}

function StatGrid({ stats }: { stats: { value: string; label: string }[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.value}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative overflow-visible px-3 py-5 rounded-2xl border border-[#C8923C]/12 bg-[#FFFDF5]/70 backdrop-blur-sm text-center group hover:border-brand-gold/30 transition-colors duration-500"
                >
                    <div className="mb-2 flex justify-center overflow-visible px-1">
                        <StatValue value={stat.value} />
                    </div>
                    <p className="text-[10px] tracking-wider text-[#8B7355] leading-snug">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
}

function QuoteBlock({ quote }: { quote: { text: string; author: string } }) {
    return (
        <motion.blockquote
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-8 pl-6 md:pl-8 border-l-2 border-[#C8923C]/50"
        >
            <Quote className="absolute -left-3 -top-1 w-6 h-6 text-[#C8923C]/30" />
            <p className="text-base md:text-lg font-light italic text-[#3D2E1A] leading-relaxed tracking-wide">
                &ldquo;{quote.text}&rdquo;
            </p>
            <footer className="mt-3 text-[10px] tracking-[0.2em] text-brand-gold uppercase">
                — {quote.author}
            </footer>
        </motion.blockquote>
    );
}

function ReadMoreButton({ href }: { href: string }) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            className="group inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8923C]/15 to-[#DEB664]/10 border border-[#C8923C]/25 text-xs tracking-[0.25em] uppercase text-[#3D2E1A] hover:from-[#C8923C]/25 hover:border-brand-gold/45 transition-all duration-300"
        >
            Read More
            <ArrowUpRight className="w-4 h-4 text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </motion.a>
    );
}

function InsightSection({
    article,
    isEven,
}: {
    article: InsightArticle;
    isEven: boolean;
}) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const Icon = article.icon;

    return (
        <motion.section
            ref={ref}
            id={article.id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative min-h-0 flex items-center py-16 md:py-20"
        >
            {/* Section glow */}
            <div
                className={`absolute ${isEven ? "right-0" : "left-0"} top-1/2 -translate-y-1/2 w-[60vw] max-w-xl h-[60vh] rounded-full blur-[100px] pointer-events-none opacity-40`}
                style={{ background: `radial-gradient(circle, ${article.glow}, transparent 70%)` }}
            />

            <div
                className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${isEven ? "" : "lg:direction-rtl"}`}
            >
                {/* Visual panel */}
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                    <div
                        className={`relative rounded-3xl border border-[#C8923C]/15 bg-gradient-to-br ${article.gradient} p-8 md:p-10 overflow-hidden backdrop-blur-sm`}
                    >
                        <span className="absolute -top-4 -right-2 text-[8rem] md:text-[10rem] font-bold text-[#C8923C]/[0.06] leading-none select-none pointer-events-none">
                            {article.index}
                        </span>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFFDF5]/80 border border-[#C8923C]/20 mb-6 shadow-lg shadow-[#C8923C]/5">
                                <Icon className="w-7 h-7 text-brand-gold" />
                            </div>

                            <span className="inline-block text-[9px] tracking-[0.35em] text-brand-gold uppercase px-3 py-1 rounded-full bg-[#C8923C]/10 border border-[#C8923C]/20 mb-4">
                                {article.tag}
                            </span>

                            <VoiceWaveBars className="h-16 mt-4 opacity-80" />

                            {article.highlight && (
                                <div className="mt-6 hidden md:block">
                                    <MarketGrowthVisual
                                        from={article.highlight.from}
                                        to={article.highlight.to}
                                        suffix={article.highlight.suffix}
                                    />
                                </div>
                            )}

                            {article.stats && (
                                <div className="mt-6 hidden md:block">
                                    <StatGrid stats={article.stats} />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Content panel */}
                <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`lg:col-span-7 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                    <p className="text-[10px] tracking-[0.4em] text-[#B8A080] mb-3">
                        INSIGHT {article.index}
                    </p>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.08em] uppercase leading-tight text-[#3D2E1A] mb-6">
                        {article.title}
                    </h2>

                    <div className="space-y-4">
                        {article.paragraphs.map((p) => (
                            <p key={p.slice(0, 40)} className="text-sm md:text-base tracking-wide text-[#8B7355] leading-relaxed">
                                {p.split(/(\$[\d.]+\s*(?:Billion|B)?|\d+%)/g).map((part, i) =>
                                    /^\$[\d.]+\s*(?:Billion|B)?$|^\d+%$/.test(part) ? (
                                        <strong key={i} className="text-[#3D2E1A] font-semibold">
                                            {part}
                                        </strong>
                                    ) : (
                                        part
                                    )
                                )}
                            </p>
                        ))}
                    </div>

                    {article.bullets && (
                        <ul className="mt-6 space-y-3">
                            {article.bullets.map((bullet, i) => (
                                <motion.li
                                    key={bullet.slice(0, 30)}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.05 * i }}
                                    className="flex gap-3 text-sm tracking-wide text-[#8B7355] leading-relaxed"
                                >
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                                    <span>
                                        {bullet.split(/(\d+%|\$[\d.]+\s*Billion)/g).map((part, j) =>
                                            /^(\d+%|\$[\d.]+\s*Billion)$/.test(part) ? (
                                                <strong key={j} className="text-[#3D2E1A]">
                                                    {part}
                                                </strong>
                                            ) : (
                                                part
                                            )
                                        )}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    )}

                    {article.highlight && (
                        <div className="mt-6 md:hidden">
                            <MarketGrowthVisual
                                from={article.highlight.from}
                                to={article.highlight.to}
                                suffix={article.highlight.suffix}
                            />
                        </div>
                    )}

                    {article.stats && (
                        <div className="md:hidden">
                            <StatGrid stats={article.stats} />
                        </div>
                    )}

                    <QuoteBlock quote={article.quote} />
                    <ReadMoreButton href={article.readMoreUrl} />
                </motion.div>
            </div>
        </motion.section>
    );
}

function HeroInsightCards() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-4xl mx-auto mt-8"
        >
            <p className="text-[9px] tracking-[0.3em] text-[#B8A080] uppercase text-center mb-3">
                4 insights · select or scroll
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {ARTICLES.map((article, i) => {
                    const Icon = article.icon;
                    return (
                        <motion.a
                            key={article.id}
                            href={`#${article.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 + i * 0.07 }}
                            whileHover={{ y: -2 }}
                            className="group flex flex-col gap-2 p-3 sm:p-4 rounded-xl border border-[#C8923C]/12 bg-[#FFFDF5]/80 backdrop-blur-sm hover:border-brand-gold/35 hover:bg-[#C8923C]/[0.04] transition-all duration-300 text-left"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] tracking-[0.2em] text-brand-gold/70">{article.index}</span>
                                <Icon className="w-3.5 h-3.5 text-brand-gold/60 group-hover:text-brand-gold transition-colors" />
                            </div>
                            <p className="text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-[#3D2E1A] leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors">
                                {article.title}
                            </p>
                        </motion.a>
                    );
                })}
            </div>
        </motion.div>
    );
}

function SectionNav({ activeId }: { activeId: string }) {
    return (
        <nav className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
            {ARTICLES.map((a) => (
                <a
                    key={a.id}
                    href={`#${a.id}`}
                    className="group flex items-center gap-3"
                    aria-label={a.title}
                >
                    <span
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeId === a.id
                            ? "bg-brand-gold scale-125 shadow-[0_0_12px_rgba(200,146,60,0.6)]"
                            : "bg-[#C8923C]/25 group-hover:bg-[#C8923C]/50"
                            }`}
                    />
                    <span
                        className={`text-[9px] tracking-[0.2em] uppercase transition-opacity duration-300 ${activeId === a.id ? "opacity-100 text-brand-gold" : "opacity-0 group-hover:opacity-60 text-[#8B7355]"
                            }`}
                    >
                        {a.index}
                    </span>
                </a>
            ))}
        </nav>
    );
}

export default function InsightsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState(ARTICLES[0].id);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        ARTICLES.forEach((article) => {
            const el = document.getElementById(article.id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(article.id);
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
            <SectionNav activeId={activeSection} />

            {/* Hero — compact so insight cards peek below the fold */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative z-10 flex flex-col items-center px-4 pt-28 pb-10 md:pt-32 md:pb-12"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-3xl mx-auto w-full"
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-brand-gold text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-3 h-3" />
                        Intelligence · Trends · Future
                    </motion.p>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.14em] uppercase leading-snug mb-4">
                        Insights Driving the{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8923C] via-[#DEB664] to-[#C8923C]">
                            Future of AI
                        </span>{" "}
                        <span className="text-[#3D2E1A]">Customer Support</span>
                    </h1>

                    <p className="text-[#8B7355] tracking-wider text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-5">
                        Explore the forces reshaping voice AI, enterprise investment, and the next generation of customer experience.
                    </p>

                    <VoiceWaveBars className="h-10 mb-2 opacity-70" />

                    <HeroInsightCards />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="mt-6 flex flex-col items-center gap-1.5"
                    >
                        <span className="text-[9px] tracking-[0.3em] text-[#B8A080] uppercase">Scroll for full stories</span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ChevronDown className="w-4 h-4 text-brand-gold/70" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Articles */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                {ARTICLES.map((article, i) => (
                    <InsightSection key={article.id} article={article} isEven={i % 2 === 0} />
                    ))}
                </div>

            {/* Footer CTA */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 py-24 px-4 text-center"
            >
                <div className="max-w-2xl mx-auto p-10 md:p-14 rounded-3xl border border-[#C8923C]/15 bg-gradient-to-br from-[#C8923C]/[0.06] to-[#FFFDF5] backdrop-blur-sm">
                    <Mic className="w-10 h-10 text-brand-gold mx-auto mb-6" />
                    <h2 className="text-xl md:text-2xl font-light tracking-[0.15em] uppercase mb-4">
                        Ready to Experience the Future?
                    </h2>
                    <p className="text-sm tracking-wider text-[#8B7355] mb-8 leading-relaxed">
                        MINISTROS brings voice-first AI customer support to life — multilingual, context-aware, and built for real businesses.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/#demo"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8923C]/20 to-[#DEB664]/15 border border-brand-gold/30 text-xs tracking-[0.2em] uppercase hover:from-[#C8923C]/30 transition-all duration-300"
                        >
                            Try the Demo
                            <ArrowUpRight className="w-4 h-4 text-brand-gold" />
                        </Link>
                        <Link
                            href="/community"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#C8923C]/15 text-xs tracking-[0.2em] uppercase text-[#8B7355] hover:text-[#3D2E1A] hover:border-brand-gold/30 transition-all duration-300"
                        >
                            Share Feedback
                        </Link>
                    </div>
            </div>
            </motion.section>
        </main>
    );
}

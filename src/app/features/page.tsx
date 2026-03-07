"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

interface PlanTier {
    name: string;
    price: string;
    period: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    highlight?: boolean;
    gradient: string;
    borderColor: string;
}

const plans: PlanTier[] = [
    {
        name: "Starter",
        price: "$0",
        period: "/ month",
        description: "Perfect for exploring MINISTROS's core capabilities.",
        icon: <Sparkles className="w-6 h-6" />,
        gradient: "from-zinc-600 to-zinc-400",
        borderColor: "border-zinc-600/30",
        features: [
            "5 voice interactions / day",
            "Basic RAG context (1 document)",
            "Standard response latency",
            "Community support",
            "Single voice model",
        ],
    },
    {
        name: "Pro",
        price: "$29",
        period: "/ month",
        description: "Unlock advanced features for power users.",
        icon: <Zap className="w-6 h-6" />,
        highlight: true,
        gradient: "from-brand-purple to-violet-400",
        borderColor: "border-brand-purple/50",
        features: [
            "Unlimited voice interactions",
            "Advanced RAG (10 documents)",
            "Priority low-latency pipeline",
            "Email & chat support",
            "Male & Female voice models",
            "Conversation history & export",
            "Custom voice tuning",
        ],
    },
    {
        name: "Enterprise",
        price: "$149",
        period: "/ month",
        description: "Full-scale deployment with dedicated resources.",
        icon: <Crown className="w-6 h-6" />,
        gradient: "from-amber-500 to-orange-400",
        borderColor: "border-amber-500/30",
        features: [
            "Everything in Pro",
            "Unlimited documents & context",
            "Dedicated GPU inference",
            "24/7 priority support & SLA",
            "Custom voice cloning",
            "API access & webhooks",
            "SSO & team management",
            "On-premise deployment option",
        ],
    },
];

function PlanCard({ plan, index }: { plan: PlanTier; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group overflow-hidden"

        >
            <motion.div
                animate={{
                    scale: isHovered ? 1.03 : 1,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`relative flex flex-col h-full rounded-3xl border ${plan.borderColor} bg-black/60 backdrop-blur-sm overflow-hidden transition-shadow duration-500 ${plan.highlight
                    ? "shadow-[0_0_60px_-10px_rgba(108,43,217,0.3)]"
                    : "shadow-lg"
                    } ${isHovered ? (plan.highlight ? "shadow-[0_0_80px_-5px_rgba(108,43,217,0.5)]" : "shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]") : ""}`}
                style={{}}
            >
                {/* Popular badge */}
                {plan.highlight && (
                    <div className="absolute top-0 right-0 bg-brand-purple text-white text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-bl-2xl font-medium">
                        Most Popular
                    </div>
                )}

                {/* Top gradient bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${plan.gradient}`} />

                <div className="p-8 flex flex-col flex-grow">
                    {/* Icon & name */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.gradient} text-white`}>
                            {plan.icon}
                        </div>
                        <h3 className="text-xl text-white font-medium tracking-wider">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <span className={`text-4xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                            {plan.price}
                        </span>
                        <span className="text-zinc-500 text-sm tracking-wider ml-1">{plan.period}</span>
                    </div>

                    <p className="text-zinc-500 text-sm tracking-wider leading-relaxed mb-8">{plan.description}</p>

                    {/* Features */}
                    <ul className="space-y-3 flex-grow mb-8">
                        {plan.features.map((feature, i) => (
                            <motion.li
                                key={feature}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15 + i * 0.05 + 0.3 }}
                                className="flex items-start gap-3 text-sm text-zinc-300"
                            >
                                <Check className={`w-4 h-4 mt-0.5 shrink-0 bg-gradient-to-r ${plan.gradient} bg-clip-text`} style={{ color: plan.highlight ? "#6c2bd9" : "#71717a" }} />
                                <span>{feature}</span>
                            </motion.li>
                        ))}
                    </ul>

                    {/* CTA button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3.5 rounded-xl text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 ${plan.highlight
                            ? "bg-brand-purple text-white hover:bg-brand-purple/90 shadow-lg shadow-brand-purple/20"
                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                            }`}
                    >
                        {plan.price === "$0" ? "Get Started Free" : "Subscribe Now"}
                    </motion.button>
                </div>

                {/* Rotating door shine effect on hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: "200%", opacity: 0.15 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
                            style={{ transform: "skewX(-15deg)" }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 overflow-hidden">
            {/* Background ambient glows */}
            <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] bg-brand-purple/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[40vw] h-[40vw] bg-violet-500/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-4">
                        Choose Your{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-violet-400">
                            Plan
                        </span>
                    </h1>
                    <p className="text-zinc-500 tracking-widest text-sm md:text-base max-w-2xl mx-auto leading-relaxed uppercase">
                        Scale your AI voice agent from personal use to enterprise deployment.
                    </p>
                </motion.div>

                {/* Scrollable tier cards with rotating-door 3D effect */}
                <div className="w-full overflow-hidden pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 min-w-0">
                        {plans.map((plan, i) => (
                            <PlanCard key={plan.name} plan={plan} index={i} />
                        ))}
                    </div>
                </div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-center text-zinc-600 text-xs tracking-[0.2em] uppercase mt-16"
                >
                    All plans include end-to-end encryption • Cancel anytime • No hidden fees
                </motion.p>
            </div>
        </main>
    );
}

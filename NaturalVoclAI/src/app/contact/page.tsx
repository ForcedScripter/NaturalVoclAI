"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Mail,
    Handshake,
    Headphones,
    ArrowRight,
    Sparkles,
    Copy,
    Check,
} from "lucide-react";
import { useState } from "react";

const CONTACT_EMAIL = "ministrosai@gmail.com";

export default function ContactPage() {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <main className="min-h-screen bg-[#FFFDF5] text-[#3D2E1A] pt-32 pb-24 px-4">
            <div className="fixed top-0 left-1/4 w-[40vw] h-[40vw] bg-brand-gold/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[35vw] h-[35vw] bg-[#DEB664]/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-14"
                >
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 mb-6"
                    >
                        <Mail className="w-8 h-8 text-brand-gold" />
                    </motion.div>
                    <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Get in Touch
                    </p>
                    <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] uppercase mb-4">
                        Reach Out{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#DEB664]">
                            To Us
                        </span>
                    </h1>
                    <p className="text-[#8B7355] tracking-widest text-sm max-w-xl mx-auto leading-relaxed">
                        We&apos;d love to hear from you — whether you&apos;re exploring our voice AI platform, looking to partner with us, or simply have a question.
                    </p>
                </motion.div>

                {/* Email card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="mb-8 bg-[#C8923C]/[0.03] border border-[#C8923C]/10 rounded-3xl p-8 md:p-10 text-center"
                >
                    <p className="text-[10px] tracking-[0.25em] text-[#8B7355] uppercase mb-4">
                        Email us at
                    </p>
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="inline-flex items-center gap-2 text-xl md:text-2xl font-medium tracking-wide text-[#3D2E1A] hover:text-brand-gold transition-colors duration-300"
                    >
                        <Mail className="w-6 h-6 text-brand-gold shrink-0" />
                        {CONTACT_EMAIL}
                    </a>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8923C]/20 to-[#DEB664]/15 border border-brand-gold/30 text-xs tracking-[0.2em] uppercase text-[#3D2E1A] hover:from-[#C8923C]/30 hover:border-brand-gold/50 transition-all duration-300"
                        >
                            Send Email
                            <ArrowRight className="w-4 h-4 text-brand-gold" />
                        </a>
                        <button
                            type="button"
                            onClick={copyEmail}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8923C]/[0.04] border border-[#C8923C]/15 text-xs tracking-[0.2em] uppercase text-[#8B7355] hover:text-[#3D2E1A] hover:border-brand-gold/30 transition-all duration-300"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-brand-gold" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Email
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="bg-[#C8923C]/[0.03] border border-[#C8923C]/10 rounded-2xl p-6 md:p-8 hover:border-brand-gold/20 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/15">
                                <Handshake className="w-5 h-5 text-brand-gold" />
                            </div>
                            <h2 className="text-sm tracking-[0.15em] uppercase font-semibold text-[#3D2E1A]">
                                Collaborations
                            </h2>
                        </div>
                        <p className="text-sm tracking-wider text-[#8B7355] leading-relaxed">
                            We&apos;re always open to meaningful partnerships — whether you&apos;re a startup, enterprise, or research team building the future of voice AI. If you have an idea to integrate, co-build, or explore MINISTROS together, reach out and let&apos;s talk.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.6 }}
                        className="bg-[#C8923C]/[0.03] border border-[#C8923C]/10 rounded-2xl p-6 md:p-8 hover:border-brand-gold/20 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/15">
                                <Headphones className="w-5 h-5 text-brand-gold" />
                            </div>
                            <h2 className="text-sm tracking-[0.15em] uppercase font-semibold text-[#3D2E1A]">
                                Service &amp; Support
                            </h2>
                        </div>
                        <p className="text-sm tracking-wider text-[#8B7355] leading-relaxed">
                            Have questions about getting started with MINISTROS, pricing, deployment, or how our AI voice agents can fit your business? Drop us a line — our team will get back to you with the answers you need.
                        </p>
                    </motion.div>
                </div>

                {/* Community CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="text-center"
                >
                    <p className="text-[#8B7355] text-xs tracking-widest mb-4">
                        Want to share product feedback instead?
                    </p>
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-brand-gold hover:text-[#3D2E1A] transition-colors duration-300"
                    >
                        Visit our Community page
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}

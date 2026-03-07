"use client";

import { motion } from "framer-motion";

// SVG logos — inline for zero network requests, instant rendering
const logos = [
    {
        name: "Amazon",
        svg: (
            <svg viewBox="0 0 120 36" className="h-7 w-auto" fill="currentColor">
                <path d="M69.7 28.3c-6.5 4.8-15.9 7.4-24 7.4-11.4 0-21.6-4.2-29.3-11.2-.6-.6-.1-1.3.6-.9 8.3 4.9 18.7 7.8 29.3 7.8 7.2 0 15.1-1.5 22.3-4.6 1.1-.5 2 .7.9 1.5h.2z" />
                <path d="M72.2 25.4c-.8-1.1-5.7-.5-7.8-.3-.7.1-.8-.5-.2-.9 3.8-2.7 10.1-1.9 10.8-1 .7.9-.2 7.3-3.8 10.3-.5.5-1.1.2-.9-.4.8-2 2.7-6.6 1.9-7.7z" />
                <path d="M64.5 4.3V1.6c0-.4.3-.7.7-.7h12.1c.4 0 .7.3.7.7v2.3c0 .4-.3.9-.9 1.7l-6.3 9c2.3-.1 4.8.3 6.9 1.5.5.3.6.7.6 1.1v2.9c0 .4-.5.9-1 .5-3.9-2-9-2.3-13.3.1-.4.2-.9-.2-.9-.6v-2.8c0-.5 0-1.2.5-1.9l7.3-10.5h-6.3c-.4 0-.7-.3-.7-.7l-.4.1zm-44 16.6h-3.7c-.4 0-.6-.3-.7-.6V1.7c0-.4.3-.7.7-.7h3.4c.4 0 .6.3.7.6v2.4h.1c.9-2.3 2.6-3.4 4.9-3.4 2.4 0 3.8 1.1 4.9 3.4.9-2.3 3-3.4 5.2-3.4 1.6 0 3.3.7 4.4 2.1 1.2 1.6 1 4 1 6.1v11.5c0 .4-.3.7-.7.7h-3.7c-.4 0-.6-.3-.6-.7V8.8c0-.8.1-2.9-.1-3.7-.3-1.3-1.2-1.7-2.4-1.7-1 0-2 .7-2.4 1.7-.4 1-.3 2.8-.3 3.7v11.5c0 .4-.3.7-.7.7h-3.7c-.4 0-.6-.3-.7-.7V8.8c0-2.2.4-5.4-2.5-5.4-2.9 0-2.8 3.1-2.8 5.4v11.5c0 .4-.3.7-.7.7v-.1zm64.2-17.3c5.5 0 8.4 4.7 8.4 10.7 0 5.8-3.3 10.4-8.4 10.4-5.3 0-8.2-4.7-8.2-10.6 0-5.9 2.9-10.5 8.2-10.5zm0 3.9c-2.7 0-2.8 3.7-2.8 6 0 2.3-.1 7.1 2.8 7.1 2.8 0 3-3.9 3-6.3 0-1.6-.1-3.4-.5-4.9-.4-1.3-1.2-1.9-2.5-1.9zm15.4 13.4h-3.7c-.4 0-.6-.3-.7-.6V1.6c0-.4.3-.7.8-.7h3.4c.3 0 .6.3.6.6v2.9h.1c1-2.7 2.3-3.9 4.7-3.9 1.7 0 3.4.6 4.5 2.3 1 1.6 1 4.2 1 6.1v11.6c0 .4-.3.6-.7.6h-3.7c-.3 0-.6-.3-.6-.6V8.6c0-2.1.2-5.3-2.5-5.3-1 0-1.9.7-2.4 1.7-.6 1.3-.6 2.5-.6 3.6v11.7c0 .4-.3.7-.8.7h.6z" />
            </svg>
        ),
    },
    {
        name: "Mahindra",
        svg: (
            <span className="text-lg font-bold tracking-[0.15em]" style={{ fontFamily: "serif" }}>
                MAHINDRA
            </span>
        ),
    },
    {
        name: "Flipkart",
        svg: (
            <svg viewBox="0 0 120 36" className="h-7 w-auto" fill="currentColor">
                <path d="M14 4h8v28h-8V18H8v14H0V4h8v8h6V4zm14 0h20v6H36v6h10v6H36v10h-8V4zm24 0h8v22h12v6H52V4zm24 0h8v28h-8V4zm14 0h8v8h6v6h-6v8c0 1 .4 2 2 2h4v4h-6c-4 0-8-2-8-6V18h-4v-6h4V4z" />
            </svg>
        ),
    },
    {
        name: "Swiggy",
        svg: (
            <span className="text-xl font-extrabold tracking-wide" style={{ color: "currentColor" }}>
                Swiggy
            </span>
        ),
    },
    {
        name: "Zomato",
        svg: (
            <span className="text-xl font-bold tracking-wider" style={{ fontFamily: "sans-serif" }}>
                zomato
            </span>
        ),
    },
    {
        name: "Reliance",
        svg: (
            <span className="text-lg font-bold tracking-[0.1em]" style={{ fontFamily: "serif" }}>
                RELIANCE
            </span>
        ),
    },
    {
        name: "Tata",
        svg: (
            <span className="text-xl font-bold tracking-[0.2em]" style={{ fontFamily: "serif" }}>
                TATA
            </span>
        ),
    },
    {
        name: "PhonePe",
        svg: (
            <span className="text-lg font-bold tracking-wider">
                PhonePe
            </span>
        ),
    },
];

// Duplicate for seamless loop
const doubled = [...logos, ...logos];

export default function TrustedByMarquee() {
    return (
        <section className="relative w-full py-16 bg-[#050505] overflow-hidden">
            {/* Top/bottom edge fades */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <p className="text-[10px] tracking-[0.4em] text-brand-purple uppercase mb-2">
                    Tested Across Industries
                </p>
                <h3 className="text-lg md:text-xl text-zinc-400 tracking-[0.2em] font-light uppercase">
                    20+ Working Instances
                </h3>
            </motion.div>

            {/* Left / right edge masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            {/* Marquee track */}
            <div className="flex marquee-track">
                {doubled.map((logo, i) => (
                    <div
                        key={`${logo.name}-${i}`}
                        className="flex items-center justify-center px-10 md:px-14 shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors duration-500"
                    >
                        {logo.svg}
                    </div>
                ))}
            </div>

            {/* CSS animation */}
            <style jsx>{`
                .marquee-track {
                    animation: marquee 30s linear infinite;
                    width: max-content;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}

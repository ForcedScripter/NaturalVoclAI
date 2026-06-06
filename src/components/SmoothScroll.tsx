"use client";

import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { ReactNode, useEffect } from "react";

/** Keeps Framer Motion scroll listeners in sync while Lenis drives the page. */
function LenisScrollBridge() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const onLenisScroll = () => {
            window.dispatchEvent(new Event("scroll"));
        };

        lenis.on("scroll", onLenisScroll);
        return () => {
            lenis.off("scroll", onLenisScroll);
        };
    }, [lenis]);

    return null;
}

const LENIS_OPTIONS = {
    lerp: 0.12,
    duration: 1.1,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    infinite: false,
};

export default function SmoothScroll({ children }: { children: ReactNode }) {
    // Lenis handles smoothing — native CSS smooth scroll fights it (especially mid-page).
    useEffect(() => {
        const html = document.documentElement;
        const previous = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";

        return () => {
            html.style.scrollBehavior = previous;
        };
    }, []);

    return (
        <ReactLenis root options={LENIS_OPTIONS}>
            <LenisScrollBridge />
            {children as any}
        </ReactLenis>
    );
}

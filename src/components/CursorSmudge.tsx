"use client";

import { useRef, useEffect, useCallback } from "react";

interface SmudgePoint {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    hue: number;
}

export default function CursorSmudge() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<SmudgePoint[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const prevMouseRef = useRef({ x: 0, y: 0 });
    const animRef = useRef<number>(0);

    const addPoint = useCallback((x: number, y: number) => {
        const dx = x - prevMouseRef.current.x;
        const dy = y - prevMouseRef.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 2) {
            const hue = 270 + Math.random() * 30 - 15; // purple hues
            pointsRef.current.push({
                x,
                y,
                radius: Math.min(80, 30 + speed * 0.5),
                opacity: 0.35,
                hue,
            });
        }

        prevMouseRef.current = { x, y };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            addPoint(e.clientX, e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fade and draw existing points
            const alive: SmudgePoint[] = [];
            for (const p of pointsRef.current) {
                p.opacity -= 0.003;
                p.radius += 0.3;
                if (p.opacity > 0) {
                    alive.push(p);
                    const gradient = ctx.createRadialGradient(
                        p.x, p.y, 0,
                        p.x, p.y, p.radius
                    );
                    gradient.addColorStop(0, `hsla(${p.hue}, 70%, 40%, ${p.opacity})`);
                    gradient.addColorStop(0.5, `hsla(${p.hue}, 60%, 30%, ${p.opacity * 0.4})`);
                    gradient.addColorStop(1, `hsla(${p.hue}, 50%, 20%, 0)`);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }
            pointsRef.current = alive;

            // Active cursor glow
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            if (mx > 0 && my > 0) {
                const g = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
                g.addColorStop(0, "hsla(270, 70%, 50%, 0.12)");
                g.addColorStop(0.5, "hsla(270, 60%, 40%, 0.05)");
                g.addColorStop(1, "hsla(270, 50%, 30%, 0)");
                ctx.beginPath();
                ctx.arc(mx, my, 120, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
            }

            animRef.current = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [addPoint]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}

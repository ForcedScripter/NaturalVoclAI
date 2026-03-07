"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import CursorSmudge from "@/components/CursorSmudge";

type Mode = "login" | "signup";

export default function LoginPage() {
    const [mode, setMode] = useState<Mode>("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || data.error || "Something went wrong");
            }

            if (mode === "signup") {
                setSuccess("Account created! Switching to login...");
                setTimeout(() => {
                    setMode("login");
                    setSuccess("");
                }, 1500);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
            <div className="fixed top-1/4 left-1/4 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-violet-500/5 rounded-full blur-[180px] pointer-events-none" />

            {/* Cursor smudge effect */}
            <CursorSmudge />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-light tracking-[0.3em] uppercase mb-2">
                        A U R A
                    </h1>
                    <p className="text-zinc-500 text-xs tracking-[0.2em]">
                        {mode === "login" ? "SIGN IN TO YOUR ACCOUNT" : "CREATE YOUR ACCOUNT"}
                    </p>
                </div>

                {/* Tab Toggle */}
                <div className="flex mb-8 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
                    {(["login", "signup"] as Mode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 text-xs tracking-[0.2em] uppercase rounded-lg transition-all duration-300 ${mode === m
                                ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/30"
                                : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            {m === "login" ? "LOGIN" : "SIGN UP"}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] tracking-[0.2em] text-zinc-500 mb-2 uppercase">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm tracking-wider text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple/40 transition-colors duration-300"
                            placeholder="Enter username"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] tracking-[0.2em] text-zinc-500 mb-2 uppercase">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={4}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm tracking-wider text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple/40 transition-colors duration-300 pr-12"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Error / Success */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-red-400 text-xs tracking-wider text-center"
                            >
                                {error}
                            </motion.p>
                        )}
                        {success && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-green-400 text-xs tracking-wider text-center"
                            >
                                {success}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-3.5 rounded-xl text-xs tracking-[0.2em] uppercase font-medium bg-brand-purple text-white hover:bg-brand-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}

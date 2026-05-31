"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";

const productLinks = [
    { label: "PRODUCT DESCRIPTION", href: "/product" },
    { label: "FEATURES", href: "/features" },
    { label: "DEMO", href: "/#demo", highlight: true },
    { label: "INSIGHTS", href: "/insights" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check auth state
    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.username) setUsername(data.username);
                else setUsername(null);
            })
            .catch(() => setUsername(null));
    }, [pathname]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileOpen(false);
        setDropdownOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUsername(null);
        router.push("/");
    };

    const isActive = (href: string) => pathname === href;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-[#FFFDF5]/90 backdrop-blur-md border-b border-[#C8923C]/10 py-3 shadow-sm shadow-[#C8923C]/5"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">

                {/* Logo — square PNG is cropped vertically to the center band; no scale hack */}
                <Link
                    href="/"
                    className="group flex h-[50px] shrink-0 items-center self-center transition-all duration-300"
                >
                    <span className="relative block h-[50px] w-[176px] overflow-hidden">
                        <img
                            src="/ministros_logo-removebg-preview.png"
                            alt="MINISTROS"
                            className="absolute left-0 top-1/2 w-full max-w-none -translate-y-1/2 transition-all duration-300 group-hover:brightness-110 group-hover:saturate-150 group-hover:drop-shadow-[0_0_14px_rgba(200,146,60,0.55)]"
                        />
                    </span>
                </Link>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="md:hidden p-2 rounded-lg text-[#8B7355] hover:text-[#3D2E1A] hover:bg-[#C8923C]/5 transition-all duration-300"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Center nav links */}
                <div className="hidden md:flex items-center gap-1">

                    {/* Products dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            onMouseEnter={() => setDropdownOpen(true)}
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs tracking-[0.2em] rounded-lg transition-all duration-300 ${dropdownOpen ? "text-[#3D2E1A] bg-[#C8923C]/10" : "text-[#8B7355] hover:text-[#3D2E1A]"
                                }`}
                        >
                            PRODUCT
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                    className="absolute top-full left-0 mt-2 w-56 bg-[#FFFDF5] border border-[#C8923C]/15 rounded-xl overflow-hidden shadow-2xl shadow-[#C8923C]/10"
                                >
                                    {productLinks.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setDropdownOpen(false)}
                                            className={`block px-5 py-3.5 text-xs tracking-[0.15em] transition-all duration-200 border-b border-[#C8923C]/[0.06] last:border-b-0 ${item.highlight
                                                ? "text-[#C8923C] font-medium bg-[#C8923C]/5 hover:bg-[#C8923C]/10"
                                                : "text-[#8B7355] hover:text-[#3D2E1A] hover:bg-[#C8923C]/[0.04]"
                                                }`}
                                        >
                                            {item.label}
                                            {item.highlight && (
                                                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#C8923C] animate-pulse" />
                                            )}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* About Us */}
                    <Link
                        href="/about"
                        className={`px-4 py-2 text-xs tracking-[0.2em] rounded-lg transition-all duration-300 ${isActive("/about") ? "text-[#3D2E1A] bg-[#C8923C]/10" : "text-[#8B7355] hover:text-[#3D2E1A]"
                            }`}
                    >
                        ABOUT US
                    </Link>

                    {/* Community */}
                    <Link
                        href="/community"
                        className={`px-4 py-2 text-xs tracking-[0.2em] rounded-lg transition-all duration-300 ${isActive("/community") ? "text-[#3D2E1A] bg-[#C8923C]/10" : "text-[#8B7355] hover:text-[#3D2E1A]"
                            }`}
                    >
                        COMMUNITY
                    </Link>
                </div>

                {/* Right — Auth */}
                <div className="hidden md:flex items-center gap-3">
                    {username ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C8923C]/5 border border-[#C8923C]/15">
                                <User className="w-3.5 h-3.5 text-[#C8923C]" />
                                <span className="text-xs tracking-widest text-[#8B7355]">{username.toUpperCase()}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg text-[#B8A080] hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2 text-xs tracking-[0.2em] rounded-lg bg-[#C8923C]/10 border border-[#C8923C]/30 text-[#C8923C] hover:bg-[#C8923C]/20 hover:border-[#C8923C]/50 transition-all duration-300"
                        >
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile panel */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="md:hidden border-t border-[#C8923C]/10 bg-[#FFFDF5]/95 backdrop-blur-md"
                    >
                        <div className="container mx-auto px-4 sm:px-6 py-4 space-y-2">
                            {/* Product links */}
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((v) => !v)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs tracking-[0.2em] text-[#8B7355] hover:text-[#3D2E1A] hover:bg-[#C8923C]/5 transition-all duration-300"
                                aria-expanded={dropdownOpen}
                            >
                                <span>PRODUCT</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="overflow-hidden rounded-lg border border-[#C8923C]/10 bg-[#C8923C]/[0.03]"
                                    >
                                        <div className="py-1">
                                            {productLinks.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`block px-4 py-3 text-xs tracking-[0.15em] transition-all duration-200 ${item.highlight
                                                        ? "text-[#C8923C] font-medium bg-[#C8923C]/5 hover:bg-[#C8923C]/10"
                                                        : "text-[#8B7355] hover:text-[#3D2E1A] hover:bg-[#C8923C]/[0.04]"
                                                        }`}
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Link
                                href="/about"
                                className={`block px-3 py-2 rounded-lg text-xs tracking-[0.2em] transition-all duration-300 ${isActive("/about") ? "text-[#3D2E1A] bg-[#C8923C]/10" : "text-[#8B7355] hover:text-[#3D2E1A] hover:bg-[#C8923C]/5"
                                    }`}
                            >
                                ABOUT US
                            </Link>

                            <Link
                                href="/community"
                                className={`block px-3 py-2 rounded-lg text-xs tracking-[0.2em] transition-all duration-300 ${isActive("/community") ? "text-[#3D2E1A] bg-[#C8923C]/10" : "text-[#8B7355] hover:text-[#3D2E1A] hover:bg-[#C8923C]/5"
                                    }`}
                            >
                                COMMUNITY
                            </Link>

                            <div className="pt-2 border-t border-[#C8923C]/10">
                                {username ? (
                                    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#C8923C]/5 border border-[#C8923C]/10">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-[#C8923C]" />
                                            <span className="text-xs tracking-widest text-[#8B7355]">{username.toUpperCase()}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="p-2 rounded-lg text-[#B8A080] hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                            title="Logout"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block text-center px-5 py-2 text-xs tracking-[0.2em] rounded-lg bg-[#C8923C]/10 border border-[#C8923C]/30 text-[#C8923C] hover:bg-[#C8923C]/20 hover:border-[#C8923C]/50 transition-all duration-300"
                                    >
                                        LOGIN
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Building2,
    Star,
    MessageSquareText,
    Lightbulb,
    IndianRupee,
    Send,
    Sparkles,
    HeartHandshake,
    CheckCircle2,
    Loader2,
} from "lucide-react";

const BUSINESS_TYPES = [
    "Retail & E-commerce",
    "Hospitality & Travel",
    "Healthcare",
    "Finance & Insurance",
    "SaaS & Technology",
    "Education",
    "Real Estate",
    "Logistics",
    "Other",
];

const inputClass =
    "w-full bg-[#C8923C]/[0.04] border border-[#C8923C]/15 rounded-xl px-4 py-3 text-sm tracking-wider text-[#3D2E1A] placeholder-[#B8A080] focus:outline-none focus:border-brand-gold/40 transition-colors duration-300";

const labelClass = "block text-[10px] tracking-[0.2em] text-[#8B7355] mb-2 uppercase";

function StarRating({
    value,
    onChange,
}: {
    value: number;
    onChange: (rating: number) => void;
}) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="p-1 rounded-lg transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
                    aria-label={`Rate ${star} out of 5`}
                >
                    <Star
                        className={`w-7 h-7 transition-colors duration-200 ${star <= (hover || value)
                            ? "fill-[#C8923C] text-[#C8923C]"
                            : "fill-transparent text-[#C8923C]/25"
                            }`}
                    />
                </button>
            ))}
            <span className="ml-3 text-xs tracking-widest text-[#8B7355]">
                {value > 0 ? `${value} / 5` : "Select rating"}
            </span>
        </div>
    );
}

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

function buildFeedbackMessage(data: {
    name: string;
    businessType: string;
    rating: number;
    improvements: string;
    productExpectation: string;
    currentPrice: string;
    desiredPrice: string;
}) {
    return [
        "New Community Feedback — MINISTROS",
        "",
        `Name: ${data.name}`,
        `Business Type: ${data.businessType}`,
        `Rating: ${data.rating}/5`,
        `Current Price (INR): ₹${Number(data.currentPrice).toLocaleString("en-IN")}`,
        `Desired Price (INR): ₹${Number(data.desiredPrice).toLocaleString("en-IN")}`,
        "",
        "Improvements Needed:",
        data.improvements,
        "",
        "Product Expectation:",
        data.productExpectation,
    ].join("\n");
}

export default function CommunityPage() {
    const [name, setName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [rating, setRating] = useState(0);
    const [improvements, setImprovements] = useState("");
    const [productExpectation, setProductExpectation] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [desiredPrice, setDesiredPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (rating === 0) {
            setError("Please select a star rating for the product.");
            return;
        }

        setLoading(true);

        if (!WEB3FORMS_ACCESS_KEY) {
            setError("Form is not configured. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to .env.local.");
            setLoading(false);
            return;
        }

        const payload = {
            name: name.trim(),
            businessType,
            rating,
            improvements: improvements.trim(),
            productExpectation: productExpectation.trim(),
            currentPrice,
            desiredPrice,
        };

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `[MINISTROS] Community feedback from ${payload.name}`,
                    from_name: "MINISTROS Community",
                    name: payload.name,
                    business_type: payload.businessType,
                    rating: `${payload.rating}/5`,
                    current_price_inr: `₹${Number(payload.currentPrice).toLocaleString("en-IN")}`,
                    desired_price_inr: `₹${Number(payload.desiredPrice).toLocaleString("en-IN")}`,
                    improvements: payload.improvements,
                    product_expectation: payload.productExpectation,
                    message: buildFeedbackMessage(payload),
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to submit feedback.");
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit feedback.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#FFFDF5] text-[#3D2E1A] flex items-center justify-center px-4 pt-24 pb-16">
                <div className="fixed top-1/4 left-1/3 w-[40vw] h-[40vw] bg-brand-gold/5 rounded-full blur-[200px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center max-w-md"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-gold/10 border border-brand-gold/20 mb-6">
                        <CheckCircle2 className="w-10 h-10 text-brand-gold" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-4">
                        Thank{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#DEB664]">
                            You
                        </span>
                    </h1>
                    <p className="text-[#8B7355] tracking-wider text-sm leading-relaxed">
                        Your feedback helps us shape MINISTROS for businesses like yours. We appreciate you being part of our community.
                    </p>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFDF5] text-[#3D2E1A] pt-32 pb-24 px-4">
            <div className="fixed top-0 right-1/4 w-[40vw] h-[40vw] bg-brand-gold/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="fixed bottom-0 left-1/4 w-[35vw] h-[35vw] bg-[#DEB664]/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 mb-6"
                    >
                        <Users className="w-8 h-8 text-brand-gold" />
                    </motion.div>
                    <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        Your Voice Matters
                    </p>
                    <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] uppercase mb-4">
                        Community{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#DEB664]">
                            Feedback
                        </span>
                    </h1>
                    <p className="text-[#8B7355] tracking-widest text-sm max-w-lg mx-auto leading-relaxed">
                        Help us build the voice AI product you actually need. Share your experience, expectations, and pricing insights.
                    </p>
                </motion.div>

                {/* Highlight pills */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-3 mb-10"
                >
                    {[
                        { icon: MessageSquareText, label: "Share feedback" },
                        { icon: Lightbulb, label: "Shape the product" },
                        { icon: Sparkles, label: "Join the community" },
                    ].map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8923C]/[0.05] border border-[#C8923C]/10 text-[10px] tracking-[0.15em] text-[#8B7355] uppercase"
                        >
                            <Icon className="w-3.5 h-3.5 text-brand-gold" />
                            {label}
                        </div>
                    ))}
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    onSubmit={handleSubmit}
                    className="bg-[#C8923C]/[0.03] border border-[#C8923C]/10 rounded-3xl p-8 md:p-10 space-y-6"
                >
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className={labelClass}>
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={inputClass}
                            placeholder="Your full name"
                        />
                    </div>

                    {/* Business type */}
                    <div>
                        <label htmlFor="businessType" className={`${labelClass} flex items-center gap-1.5`}>
                            <Building2 className="w-3 h-3 text-brand-gold" />
                            Business Type
                        </label>
                        <select
                            id="businessType"
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            required
                            className={`${inputClass} cursor-pointer appearance-none`}
                        >
                            <option value="" disabled>
                                Select your business type
                            </option>
                            {BUSINESS_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className={`${labelClass} flex items-center gap-1.5`}>
                            <Star className="w-3 h-3 text-brand-gold" />
                            Current Product Rating
                        </label>
                        <StarRating value={rating} onChange={setRating} />
                    </div>

                    {/* Improvements */}
                    <div>
                        <label htmlFor="improvements" className={labelClass}>
                            What improvements are needed in the current system?
                        </label>
                        <textarea
                            id="improvements"
                            value={improvements}
                            onChange={(e) => setImprovements(e.target.value)}
                            required
                            rows={4}
                            className={`${inputClass} resize-y min-h-[100px]`}
                            placeholder="Tell us what could work better — features, reliability, voice quality, integrations..."
                        />
                    </div>

                    {/* Product expectation */}
                    <div>
                        <label htmlFor="productExpectation" className={labelClass}>
                            What kind of product do you expect?
                        </label>
                        <textarea
                            id="productExpectation"
                            value={productExpectation}
                            onChange={(e) => setProductExpectation(e.target.value)}
                            required
                            rows={4}
                            className={`${inputClass} resize-y min-h-[100px]`}
                            placeholder="Describe your ideal AI voice agent — use cases, languages, deployment, support..."
                        />
                    </div>

                    {/* Pricing row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="currentPrice" className={`${labelClass} flex items-center gap-1.5`}>
                                <IndianRupee className="w-3 h-3 text-brand-gold" />
                                Current Price for Similar Services (INR)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355] text-sm">₹</span>
                                <input
                                    id="currentPrice"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={currentPrice}
                                    onChange={(e) => setCurrentPrice(e.target.value)}
                                    required
                                    className={`${inputClass} pl-8`}
                                    placeholder="e.g. 5000"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="desiredPrice" className={`${labelClass} flex items-center gap-1.5`}>
                                <IndianRupee className="w-3 h-3 text-brand-gold" />
                                Desired Product Price (INR)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355] text-sm">₹</span>
                                <input
                                    id="desiredPrice"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={desiredPrice}
                                    onChange={(e) => setDesiredPrice(e.target.value)}
                                    required
                                    className={`${inputClass} pl-8`}
                                    placeholder="e.g. 2999"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-600/80 text-xs tracking-wider text-center">{error}</p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#C8923C]/20 to-[#DEB664]/15 border border-brand-gold/30 text-[#3D2E1A] text-xs tracking-[0.25em] uppercase font-medium hover:from-[#C8923C]/30 hover:to-[#DEB664]/25 hover:border-brand-gold/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 text-brand-gold" />
                                Submit Feedback
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </main>
    );
}

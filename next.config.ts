import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // ── HTTP caching headers ─────────────────────────────────────────────────
  // Static assets (videos, images, fonts) get 1-year immutable cache.
  // HTML pages stay short-lived so updates land immediately.
  async headers() {
    return [
      {
        // Videos — cache for 1 year, serve from CDN edge
        source: "/demos/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" }, // enables video seeking
        ],
      },
      {
        source: "/hero-loop.mp4",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        source: "/scrollytelling.mp4",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        // Image sequence frames
        source: "/sequence-1/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // All other static assets (fonts, svgs, etc.)
        source: "/:path*.(jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot|webp|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // All pages — short cache, revalidate frequently
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          // Security headers (bonus perf — prevents clickjacking overhead)
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // ── Compression ───────────────────────────────────────────────────────────
  compress: true,

  // ── Image optimization (for any Next/Image components) ───────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  // ── Reduce bundle size — only include needed locales ─────────────────────
  // (remove if you add i18n later)
  // i18n: undefined,

  // ── Experimental: optimise CSS ────────────────────────────────────────────
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

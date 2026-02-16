"use client";

import { useRef } from "react";
import { Play, ExternalLink } from "lucide-react";
import { motion, useInView } from "framer-motion";

const TIKTOK_VIDEOS = [
  {
    id: "7252493825250282795",
    title: "Game-Day Finishing & Surprise Drill",
    caption: "Wait till end for a surprise #soccer #football #ecnl #mlsnext",
    href: "https://www.tiktok.com/@colintakahashi/video/7252493825250282795",
    thumbnail: "/thumbnails/tiktok-1.jpg",
  },
  {
    id: "7561244470696512799",
    title: "Daily Technical Training Routine",
    caption: "im still tryna learn #soccer #football #drills #mlsnext #japan",
    href: "https://www.tiktok.com/@colintakahashi/video/7561244470696512799",
    thumbnail: "/thumbnails/tiktok-2.jpg",
  },
  {
    id: "7592793193855388959",
    title: "J-League Inspired Footwork Drills",
    caption: "ao tanaka can have my kids #soccer #football #mlsnext #japan #training",
    href: "https://www.tiktok.com/@colintakahashi/video/7592793193855388959",
    thumbnail: "/thumbnails/tiktok-3.jpg",
  },
  {
    id: "7591591670592949534",
    title: "1v1 Moves & Ball Mastery Session",
    caption: "dont play w me #soccer #football #drills #training #mlsnext",
    href: "https://www.tiktok.com/@colintakahashi/video/7591591670592949534",
    thumbnail: "/thumbnails/tiktok-4.jpg",
  },
];

export default function ContentSection() {
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const ctaRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-50px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <section id="content" className="pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-4"
        >
          <a
            href="https://www.youtube.com/@Colintakahashi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-600/20 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            YouTube Channel
          </a>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          Inside CT19 Training
        </motion.h2>
        {/* Video grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIKTOK_VIDEOS.map((video, i) => (
            <motion.a
              key={video.id}
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#111a2e] border border-white/5 group-hover:border-brand-500/30 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-brand-500/10 transition-all duration-300">
                {/* Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt={video.caption}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-black/50 group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
                {/* TikTok badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.17z" />
                  </svg>
                  TikTok
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300 transition line-clamp-2">
                {video.title}
              </p>
            </motion.a>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <a
            href="https://www.youtube.com/@Colintakahashi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Subscribe on YouTube
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.tiktok.com/@colintakahashi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.17z" />
            </svg>
            Follow on TikTok
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

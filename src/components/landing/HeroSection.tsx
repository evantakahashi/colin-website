"use client";

import { Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 pb-10 md:pb-14">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6"
          >
            <Trophy className="w-4 h-4" />
            Elite Player Development
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Train Like a{" "}
            <span className="text-brand-500">Professional</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg text-slate-400 max-w-lg mb-8"
          >
            Elevate your game with a trainer who understands your drive.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition"
            >
              Book a Session
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#content"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </motion.div>

          {/* Mobile hero image */}
          <motion.div variants={fadeIn} className="mt-8 md:hidden flex justify-center">
            <img
              src="/logo.png"
              alt="CT19 Training logo"
              loading="lazy"
              className="w-48 h-48 rounded-full object-cover drop-shadow-[0_0_30px_rgba(13,94,175,0.3)]"
            />
          </motion.div>
        </motion.div>

        {/* Right placeholder */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="show"
          className="hidden md:block relative"
        >
          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="CT19 Training logo"
              loading="lazy"
              className="w-80 h-80 rounded-full object-cover drop-shadow-[0_0_40px_rgba(13,94,175,0.3)]"
            />
          </div>
          {/* Decorative glow */}
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-brand-600/10 rounded-full blur-3xl animate-pulse-glow" />
        </motion.div>
      </div>
    </section>
  );
}

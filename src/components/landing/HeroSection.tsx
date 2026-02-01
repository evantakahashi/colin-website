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
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <Trophy className="w-4 h-4" />
            Elite Player Development
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Train Like a{" "}
            <span className="text-blue-500">Professional</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg text-slate-400 max-w-lg mb-8"
          >
            Private soccer training sessions designed to elevate your game.
            Expert coaching, personalized programs, and proven results.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
            >
              Book a Session
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* Right placeholder */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="show"
          className="hidden md:block relative"
        >
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5">
            <img
              src="/hero.jpg"
              alt="Soccer player at NorCal Premier Soccer showcase"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative glow */}
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl animate-pulse-glow" />
        </motion.div>
      </div>
    </section>
  );
}

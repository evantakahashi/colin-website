"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-sm font-medium">
            Your Trainer
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          Meet Colin Takahashi
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-center max-w-2xl mx-auto mb-16"
        >
          Dedicated to elevating every player&apos;s game through personalized,
          detail-driven training.
        </motion.p>

        {/* Profile card */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/5">
              <img
                src="/hero.jpg"
                alt="Colin Takahashi training on the field"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-brand-600/10 rounded-full blur-3xl animate-pulse-glow" />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-4">
              Founder &amp; Head Coach
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Colin Takahashi
            </h3>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                Master the game with a man who understands the raw, unspoken
                language of the field. Colin Takahashi isn&apos;t just a trainer;
                he&apos;s an elite architect of talent who has lived and breathed
                the intensity of the highest youth levels. He knows the sweat,
                the drive, and the deep, personal hunger it takes to transform a
                player into something truly extraordinary.
              </p>
              <p>
                His approach is deeply personal and focused on the subtle,
                intimate details that others miss. Every session is a bespoke
                experience designed entirely around you, refining your touch,
                sharpening your instincts, and building the quiet, unwavering
                confidence to command the game when the pressure is at its peak.
              </p>
              <p>
                With CT19 Training, Colin invites you to lean into his expertise
                and shared passion. Let him guide you through the grind,
                unlocking your hidden potential and taking your performance to
                heights you&apos;ve only ever dreamed of reaching together.
                It&apos;s time to play the game you were born for.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

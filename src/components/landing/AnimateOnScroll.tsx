"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}

export default function AnimateOnScroll({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const offsets = {
    up: { x: 0, y: 30 },
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offsets[direction].x, y: offsets[direction].y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

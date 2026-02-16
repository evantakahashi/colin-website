"use client";

import { DURATIONS, PRICING, ORIGINAL_PRICING, Duration } from "@/lib/constants";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const DESCRIPTIONS: Record<Duration, string> = {
  60: "Focused skill work — perfect for targeted improvement",
  90: "Extended session — deep dive into technique & game scenarios",
};

interface DurationSelectorProps {
  selected?: Duration;
  onSelect: (d: Duration) => void;
}

export default function DurationSelector({ selected, onSelect }: DurationSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        Session Length
      </h3>
      <div className="flex flex-col gap-3">
        {DURATIONS.map((d) => (
          <motion.button
            key={d}
            onClick={() => onSelect(d)}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg text-left transition-all duration-200 cursor-pointer ${
              selected === d
                ? "bg-white ring-2 ring-brand-400"
                : "bg-brand-600 hover:bg-brand-500"
            }`}
          >
            <span className={`text-base font-semibold ${selected === d ? "text-brand-600" : "text-white"}`}>
              {d} min —{" "}
              <span className="line-through text-red-400 decoration-red-500 decoration-2">${ORIGINAL_PRICING[d]}</span>{" "}
              <span className="text-green-400">${PRICING[d]}</span>
            </span>
            <p className={`text-sm mt-1 ${selected === d ? "text-brand-500/70" : "text-brand-100/70"}`}>
              {DESCRIPTIONS[d]}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

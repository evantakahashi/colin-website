"use client";

import { DURATIONS, PRICING, Duration } from "@/lib/constants";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="flex flex-wrap gap-3">
        {DURATIONS.map((d) => (
          <motion.button
            key={d}
            onClick={() => onSelect(d)}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer border ${
              selected === d
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white/5 text-slate-300 border-white/10 hover:border-blue-500/50 hover:text-white"
            }`}
          >
            {d} min — ${PRICING[d]}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

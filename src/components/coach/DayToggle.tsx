"use client";

import { WEEKDAY_LABELS } from "@/lib/constants";

interface DayToggleProps {
  weekday: number;
  enabled: boolean;
  onToggle: (weekday: number) => void;
}

export default function DayToggle({ weekday, enabled, onToggle }: DayToggleProps) {
  return (
    <button
      onClick={() => onToggle(weekday)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
        enabled
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white/5 text-slate-500 border-white/10 hover:text-slate-300"
      }`}
    >
      {WEEKDAY_LABELS[weekday]?.slice(0, 3)}
    </button>
  );
}

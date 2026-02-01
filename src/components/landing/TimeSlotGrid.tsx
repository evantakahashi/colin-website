"use client";

import { TimeSlot } from "@/lib/types";
import { formatTimeDisplay } from "@/lib/slots";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelect: (time: string) => void;
  loading?: boolean;
}

export default function TimeSlotGrid({
  slots,
  selectedTime,
  onSelect,
  loading,
}: TimeSlotGridProps) {
  if (loading) {
    return (
      <div className="text-center py-8 text-slate-500">
        Loading available times...
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No available times for this date and duration.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        Available Times (Pacific)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {slots.map((slot, i) => (
          <motion.button
            key={slot.start}
            onClick={() => onSelect(slot.start)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03, ease: "easeOut" }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border ${
              selectedTime === slot.start
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white/5 text-slate-300 border-white/10 hover:border-blue-500/50 hover:text-white"
            }`}
          >
            {formatTimeDisplay(slot.start)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

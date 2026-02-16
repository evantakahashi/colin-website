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

  const groups = [
    { label: "Morning", slots: slots.filter(s => parseInt(s.start) < 12) },
    { label: "Afternoon", slots: slots.filter(s => { const h = parseInt(s.start); return h >= 12 && h < 17; }) },
    { label: "Evening", slots: slots.filter(s => parseInt(s.start) >= 17) },
  ].filter(g => g.slots.length > 0);

  let slotIndex = 0;

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        Available Times (Pacific)
      </h3>
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{group.label}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {group.slots.map((slot) => {
                const i = slotIndex++;
                return (
                  <motion.button
                    key={slot.start}
                    onClick={() => onSelect(slot.start)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03, ease: "easeOut" }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 px-5 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointer ${
                      selectedTime === slot.start
                        ? "bg-white text-brand-600 ring-2 ring-brand-400"
                        : "bg-brand-600 text-white hover:bg-brand-500"
                    }`}
                  >
                    {formatTimeDisplay(slot.start)}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

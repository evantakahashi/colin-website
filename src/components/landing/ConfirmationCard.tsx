"use client";

import GlassCard from "@/components/ui/GlassCard";
import { CheckCircle, Smartphone, Mail } from "lucide-react";
import { VENMO_HANDLE, ZELLE_INFO } from "@/lib/constants";
import { Booking } from "@/lib/types";
import { formatTimeDisplay } from "@/lib/slots";
import { motion } from "framer-motion";

interface ConfirmationCardProps {
  booking: Booking;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function ConfirmationCard({ booking }: ConfirmationCardProps) {
  return (
    <GlassCard className="max-w-lg mx-auto text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-2">
          Booking Confirmed!
        </motion.h2>
        <motion.p variants={fadeUp} className="text-slate-400 mb-6">
          Your {booking.duration_minutes}-minute session is booked.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 text-left space-y-1 text-sm"
        >
          <p className="text-slate-300"><span className="font-medium text-white">Name:</span> {booking.player_name}</p>
          <p className="text-slate-300"><span className="font-medium text-white">Date:</span> {booking.date}</p>
          <p className="text-slate-300">
            <span className="font-medium text-white">Time:</span>{" "}
            {formatTimeDisplay(booking.start_time)} – {formatTimeDisplay(booking.end_time)} (Pacific)
          </p>
          <p className="text-slate-300"><span className="font-medium text-white">Duration:</span> {booking.duration_minutes} min</p>
        </motion.div>

        <motion.div variants={fadeUp} className="border-t border-white/10 pt-4">
          <p className="text-sm text-slate-500 mb-3">
            Alternative payment methods (if applicable):
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Smartphone className="w-4 h-4" />
              <span>Venmo: <span className="font-medium text-white">{VENMO_HANDLE}</span></span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Mail className="w-4 h-4" />
              <span>Zelle: <span className="font-medium text-white">{ZELLE_INFO}</span></span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </GlassCard>
  );
}

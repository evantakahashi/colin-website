"use client";

import { useEffect, useState } from "react";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import CalendarPicker from "./CalendarPicker";
import DurationSelector from "./DurationSelector";
import TimeSlotGrid from "./TimeSlotGrid";
import BookingForm from "./BookingForm";
import GlassCard from "@/components/ui/GlassCard";
import { AvailabilityRow, TimeSlot } from "@/lib/types";
import { TIMEZONE } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function BookingFlow() {
  const {
    step,
    selectedDate,
    selectedDuration,
    selectedTime,
    goToStep,
    selectDate,
    selectDuration,
    selectTime,
    reset,
  } = useBookingFlow();

  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch availability on mount
  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) ? setAvailability(data) : setAvailability([]))
      .catch(() => {});
  }, []);

  // Fetch slots when date + duration are selected
  useEffect(() => {
    if (!selectedDate || !selectedDuration) return;

    setSlotsLoading(true);
    setSlots([]);

    const dateStr = selectedDate.toLocaleDateString("en-CA", { timeZone: TIMEZONE });

    fetch(`/api/bookings?date=${dateStr}`)
      .then((r) => r.json())
      .then((bookings) => {
        if (!Array.isArray(bookings)) bookings = [];
        const formatter = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          timeZone: TIMEZONE,
        });
        const dayName = formatter.format(selectedDate);
        const map: Record<string, number> = {
          Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
        };
        const weekday = map[dayName] ?? 0;
        const avail = availability.find((a) => a.weekday === weekday);

        if (!avail || !avail.enabled) {
          setSlots([]);
          setSlotsLoading(false);
          return;
        }

        import("@/lib/slots").then(({ generateSlots }) => {
          const available = generateSlots(avail, bookings, selectedDuration);
          setSlots(available);
          setSlotsLoading(false);
        });
      })
      .catch(() => setSlotsLoading(false));
  }, [selectedDate, selectedDuration, availability]);

  const disabledDays = availability
    .filter((a) => !a.enabled)
    .map((a) => a.weekday);

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-CA", { timeZone: TIMEZONE })
    : "";

  const endTime =
    selectedTime && selectedDuration
      ? (() => {
          const [h, m] = selectedTime.split(":").map(Number);
          const total = h * 60 + m + selectedDuration;
          const eh = Math.floor(total / 60);
          const em = total % 60;
          return `${eh.toString().padStart(2, "0")}:${em.toString().padStart(2, "0")}`;
        })()
      : "";

  async function handleCheckout(data: {
    playerName: string;
    playerEmail: string;
    playerPhone: string;
  }) {
    setCheckoutLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: dateStr,
          startTime: selectedTime,
          endTime,
          duration: selectedDuration,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        setCheckoutLoading(false);
        return;
      }

      window.location.href = result.url;
    } catch {
      setError("Failed to connect to server");
      setCheckoutLoading(false);
    }
  }

  function renderBackButton(targetStep: "date" | "duration" | "time") {
    return (
      <button
        onClick={() => goToStep(targetStep)}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-white transition mb-4 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
    );
  }

  const steps = ["date", "duration", "time", "form"] as const;
  const stepIndex = steps.indexOf(step);

  return (
    <GlassCard className="max-w-2xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <motion.div
              animate={step === s ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={step === s ? { duration: 0.3 } : {}}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step === s
                  ? "bg-blue-600 text-white"
                  : (stepIndex > i
                    ? "bg-blue-600/20 text-blue-400"
                    : "bg-white/5 text-slate-500")
              }`}
            >
              {i + 1}
            </motion.div>
            {i < 3 && (
              <div className={`w-8 h-0.5 ${
                stepIndex > i
                  ? "bg-blue-600/30"
                  : "bg-white/10"
              }`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "date" && (
          <motion.div
            key="date"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Select a Date
            </h2>
            <CalendarPicker
              selected={selectedDate}
              onSelect={selectDate}
              disabledDays={disabledDays}
            />
          </motion.div>
        )}

        {step === "duration" && (
          <motion.div
            key="duration"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderBackButton("date")}
            <DurationSelector selected={selectedDuration} onSelect={selectDuration} />
          </motion.div>
        )}

        {step === "time" && (
          <motion.div
            key="time"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderBackButton("duration")}
            <TimeSlotGrid
              slots={slots}
              selectedTime={selectedTime}
              onSelect={selectTime}
              loading={slotsLoading}
            />
          </motion.div>
        )}

        {step === "form" && (
          <motion.div
            key="form"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderBackButton("time")}
            <BookingForm
              date={dateStr}
              startTime={selectedTime!}
              endTime={endTime}
              duration={selectedDuration!}
              onSubmit={handleCheckout}
              loading={checkoutLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

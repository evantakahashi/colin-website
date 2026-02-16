"use client";

import { useEffect, useState } from "react";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import CalendarPicker from "./CalendarPicker";
import DurationSelector from "./DurationSelector";
import TimeSlotGrid from "./TimeSlotGrid";
import LocationSelector from "./LocationSelector";
import BookingForm from "./BookingForm";
import GlassCard from "@/components/ui/GlassCard";
import { AvailabilityRow, TimeSlot } from "@/lib/types";
import { TIMEZONE, LOCATIONS } from "@/lib/constants";
import { formatTimeDisplay } from "@/lib/slots";
import { ChevronLeft, Check } from "lucide-react";
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
    selectedLocation,
    selectedDuration,
    selectedTime,
    goToStep,
    selectDate,
    selectLocation,
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
          location: selectedLocation?.id,
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

  function renderBackButton(targetStep: "date" | "location" | "duration" | "time") {
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

  const steps = ["date", "location", "duration", "time", "form"] as const;
  const stepLabels = ["Date", "Location", "Length", "Time", "Book"] as const;
  const stepIndex = steps.indexOf(step);

  const progressBar = (
    <div className="flex bg-[#0a0f1e]">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-[family-name:var(--font-montserrat)] font-bold uppercase tracking-wide transition-colors border-b-2 ${
            step === s
              ? "text-white border-brand-500"
              : stepIndex > i
                ? "text-brand-400 border-transparent"
                : "text-slate-500 border-transparent"
          }`}
        >
          {stepIndex > i && <Check className="w-4 h-4" />}
          {stepLabels[i]}
        </div>
      ))}
    </div>
  );

  return (
    <GlassCard className="max-w-3xl mx-auto min-h-[480px]" topBar={progressBar}>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {(selectedDate || selectedDuration || selectedTime) && step !== "date" && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          {selectedDate && (
            <span className="px-2 py-0.5 bg-white/5 rounded text-slate-300">
              {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: TIMEZONE })}
            </span>
          )}
          {selectedLocation && (
            <>
              <span>→</span>
              <span className="px-2 py-0.5 bg-white/5 rounded text-slate-300">{selectedLocation.name}</span>
            </>
          )}
          {selectedDuration && (
            <>
              <span>→</span>
              <span className="px-2 py-0.5 bg-white/5 rounded text-slate-300">{selectedDuration} min</span>
            </>
          )}
          {selectedTime && (
            <>
              <span>→</span>
              <span className="px-2 py-0.5 bg-white/5 rounded text-slate-300">{formatTimeDisplay(selectedTime)}</span>
            </>
          )}
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

        {step === "location" && (
          <motion.div
            key="location"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderBackButton("date")}
            <LocationSelector selected={selectedLocation} onSelect={selectLocation} />
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
            {renderBackButton("location")}
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
              location={selectedLocation!}
              onSubmit={handleCheckout}
              loading={checkoutLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

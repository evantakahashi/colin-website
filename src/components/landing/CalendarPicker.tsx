"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { TIMEZONE } from "@/lib/constants";
import { useEffect, useState } from "react";

interface CalendarPickerProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabledDays?: number[]; // weekday numbers that are disabled
}

export default function CalendarPicker({
  selected,
  onSelect,
  disabledDays = [],
}: CalendarPickerProps) {
  const [today, setToday] = useState<Date>(() => {
    // Initialize to midnight to avoid time-of-day comparison issues
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  useEffect(() => {
    // Correct to Pacific midnight after hydration
    const now = new Date();
    const pacificStr = now.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
    setToday(new Date(pacificStr + "T00:00:00"));
  }, []);

  const disabledMatcher = (date: Date) => {
    if (date < today) return true;
    const dayStr = date.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
    const d = new Date(dayStr + "T12:00:00");
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: TIMEZONE,
    });
    const dayName = formatter.format(d);
    const map: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };
    return disabledDays.includes(map[dayName] ?? -1);
  };

  return (
    <div className="flex justify-center">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        disabled={disabledMatcher}
        fromDate={today}
      />
    </div>
  );
}

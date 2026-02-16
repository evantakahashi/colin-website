"use client";

import { useState } from "react";
import { BookingStep } from "@/lib/types";
import { Duration, Location } from "@/lib/constants";

export function useBookingFlow() {
  const [step, setStep] = useState<BookingStep>("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<Duration | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  function goToStep(s: BookingStep) {
    setStep(s);
  }

  function selectDate(date: Date) {
    setSelectedDate(date);
    setStep("location");
  }

  function selectLocation(location: Location) {
    setSelectedLocation(location);
    setStep("duration");
  }

  function selectDuration(d: Duration) {
    setSelectedDuration(d);
    setStep("time");
  }

  function selectTime(time: string) {
    setSelectedTime(time);
    setStep("form");
  }

  function reset() {
    setStep("date");
    setSelectedDate(undefined);
    setSelectedLocation(undefined);
    setSelectedDuration(undefined);
    setSelectedTime(undefined);
  }

  return {
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
  };
}

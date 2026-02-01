"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Duration, PRICING } from "@/lib/constants";
import { formatTimeDisplay } from "@/lib/slots";

interface BookingFormProps {
  date: string;
  startTime: string;
  endTime: string;
  duration: Duration;
  onSubmit: (data: { playerName: string; playerEmail: string; playerPhone: string }) => void;
  loading?: boolean;
}

export default function BookingForm({
  date,
  startTime,
  endTime,
  duration,
  onSubmit,
  loading,
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ playerName: name, playerEmail: email, playerPhone: phone });
  }

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg text-sm">
        <p className="font-medium text-blue-400">Session Summary</p>
        <p className="text-slate-300">{date} at {formatTimeDisplay(startTime)} – {formatTimeDisplay(endTime)}</p>
        <p className="text-slate-300">{duration} minutes — <span className="font-semibold text-white">${PRICING[duration]}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Smith"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="john@example.com"
        />
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="(555) 123-4567"
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Redirecting to payment..." : `Pay $${PRICING[duration]} with Stripe`}
        </Button>
      </form>
    </div>
  );
}

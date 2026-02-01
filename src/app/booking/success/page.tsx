"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ConfirmationCard from "@/components/landing/ConfirmationCard";
import { Booking } from "@/lib/types";
import { Loader2 } from "lucide-react";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    async function checkBooking() {
      try {
        const res = await fetch("/api/bookings");
        const bookings: Booking[] = await res.json();
        const found = bookings.find(
          (b) => b.stripe_session_id === sessionId && b.status === "confirmed"
        );

        if (found) {
          setBooking(found);
          setLoading(false);
          return;
        }

        const pending = bookings.find(
          (b) => b.stripe_session_id === sessionId
        );

        attempts++;
        if (attempts >= maxAttempts) {
          if (pending) {
            setBooking({ ...pending, status: "confirmed" });
          } else {
            setError("Booking not found. Please contact us if payment was completed.");
          }
          setLoading(false);
          return;
        }

        setTimeout(checkBooking, 2000);
      } catch {
        setError("Failed to load booking details");
        setLoading(false);
      }
    }

    checkBooking();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen pitch-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pitch-bg flex items-center justify-center p-4">
        <div className="bg-[#111a2e] border border-white/10 rounded-xl p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/" className="text-blue-500 hover:text-blue-400 transition">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pitch-bg flex items-center justify-center p-4">
      <div className="w-full py-12">
        {booking && <ConfirmationCard booking={booking} />}
        <div className="text-center mt-6">
          <a href="/" className="text-blue-500 hover:text-blue-400 transition text-sm">
            Book another session
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pitch-bg flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Booking } from "@/lib/types";
import { formatTimeDisplay } from "@/lib/slots";
import { isWithinCancellationWindow } from "@/lib/cancellation";
import { Calendar, XCircle } from "lucide-react";

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelMessage, setCancelMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  function openCancelModal(b: Booking) {
    setCancelTarget(b);
    setCancelMessage("");
    setCancelError(null);
  }

  function closeCancelModal() {
    if (submitting) return;
    setCancelTarget(null);
    setCancelMessage("");
    setCancelError(null);
  }

  async function submitCancel() {
    if (!cancelTarget) return;
    setSubmitting(true);
    setCancelError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cancelTarget.id,
          status: "cancelled",
          cancellationMessage: cancelMessage,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Request failed" }));
        setCancelError(error || "Request failed");
        setSubmitting(false);
        return;
      }

      setCancelTarget(null);
      setCancelMessage("");
      setSubmitting(false);
      fetchBookings();
    } catch {
      setCancelError("Network error — try again");
      setSubmitting(false);
    }
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    confirmed: "bg-green-500/10 text-green-400 border border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  if (loading) return <p className="text-slate-500">Loading bookings...</p>;

  const activeBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-slate-400" />
        Bookings
      </h3>

      {activeBookings.length === 0 ? (
        <p className="text-slate-500 text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-2">
          {activeBookings.map((b) => {
            const canCancel = isWithinCancellationWindow(b);
            return (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="text-sm">
                  <p className="font-medium text-white">{b.player_name}</p>
                  <p className="text-slate-400">
                    {b.date} · {formatTimeDisplay(b.start_time)} – {formatTimeDisplay(b.end_time)} · {b.duration_minutes}min
                  </p>
                  <p className="text-slate-500 text-xs">{b.player_email} · {b.player_phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                  {canCancel && (
                    <button
                      onClick={() => openCancelModal(b)}
                      className="text-red-400 hover:text-red-500 transition cursor-pointer"
                      title="Cancel booking"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelTarget && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closeCancelModal}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-white font-semibold text-lg mb-1">Cancel booking</h4>
            <p className="text-slate-400 text-sm mb-4">
              {cancelTarget.player_name} · {cancelTarget.date} at {formatTimeDisplay(cancelTarget.start_time)}
            </p>
            <p className="text-slate-400 text-sm mb-4">
              The client will be refunded and emailed automatically.
            </p>

            <label className="block text-slate-300 text-sm mb-1" htmlFor="cancel-msg">
              Message to client (optional)
            </label>
            <textarea
              id="cancel-msg"
              value={cancelMessage}
              onChange={(e) => setCancelMessage(e.target.value)}
              rows={4}
              placeholder="e.g. Field is closed due to weather."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-white/20"
              disabled={submitting}
            />

            {cancelError && (
              <p className="text-red-400 text-sm mt-3">{cancelError}</p>
            )}

            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={closeCancelModal}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition disabled:opacity-50"
              >
                Keep booking
              </button>
              <button
                onClick={submitCancel}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-50"
              >
                {submitting ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

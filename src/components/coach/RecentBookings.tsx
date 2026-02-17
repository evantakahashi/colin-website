"use client";

import { useEffect, useState } from "react";
import { Booking } from "@/lib/types";
import { formatTimeDisplay } from "@/lib/slots";
import { Calendar, XCircle } from "lucide-react";

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function cancelBooking(id: string) {
    if (!confirm("Cancel this booking?")) return;

    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "cancelled" }),
    });

    if (res.ok) {
      fetchBookings();
    }
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    confirmed: "bg-green-500/10 text-green-400 border border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  if (loading) return <p className="text-slate-500">Loading bookings...</p>;

  const activeBookings = bookings.filter((b) => b.status === "confirmed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-slate-400" />
        Bookings
      </h3>

      {bookings.length === 0 ? (
        <p className="text-slate-500 text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-2">
          {[...activeBookings, ...cancelledBookings].map((b) => (
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
                {b.status !== "cancelled" && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-400 hover:text-red-500 transition cursor-pointer"
                    title="Cancel booking"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

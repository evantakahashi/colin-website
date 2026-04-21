import { Booking } from "@/lib/types";

export const GRACE_PERIOD_DAYS = 7;

export function sessionEndMs(booking: Pick<Booking, "date" | "end_time">): number {
  const [h, m] = booking.end_time.split(":");
  return new Date(`${booking.date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`).getTime();
}

export function isWithinCancellationWindow(
  booking: Pick<Booking, "date" | "end_time">,
  now: Date = new Date()
): boolean {
  const graceMs = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;
  return now.getTime() - sessionEndMs(booking) <= graceMs;
}

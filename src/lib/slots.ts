import { AvailabilityRow, Booking, TimeSlot } from "./types";
import { TIMEZONE } from "./constants";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

export function generateSlots(
  availability: AvailabilityRow,
  bookings: Booking[],
  durationMinutes: number
): TimeSlot[] {
  if (!availability.enabled) return [];

  const slots: TimeSlot[] = [];

  for (const block of availability.blocks) {
    const blockStart = timeToMinutes(block.start);
    const blockEnd = timeToMinutes(block.end);

    // Generate 30-min increment start times
    for (let start = blockStart; start + durationMinutes <= blockEnd; start += 30) {
      const end = start + durationMinutes;
      const startStr = minutesToTime(start);
      const endStr = minutesToTime(end);

      // Check if this slot overlaps with any existing booking
      const overlaps = bookings.some((b) => {
        if (b.status === "cancelled") return false;
        // Skip stale pending bookings (>15 min old)
        if (b.status === "pending") {
          const created = new Date(b.created_at).getTime();
          const now = Date.now();
          if (now - created > 15 * 60 * 1000) return false;
        }
        const bStart = timeToMinutes(b.start_time);
        const bEnd = timeToMinutes(b.end_time);
        return start < bEnd && end > bStart;
      });

      if (!overlaps) {
        slots.push({ start: startStr, end: endStr });
      }
    }
  }

  return slots;
}

export function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function getWeekday(dateStr: string): number {
  // Parse as Pacific time to get correct weekday
  const date = new Date(dateStr + "T12:00:00");
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: TIMEZONE,
  });
  const dayName = formatter.format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[dayName] ?? 0;
}

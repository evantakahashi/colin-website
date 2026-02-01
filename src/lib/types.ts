export interface Booking {
  id: string;
  player_name: string;
  player_email: string;
  player_phone: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  duration_minutes: number;
  status: "pending" | "confirmed" | "cancelled";
  stripe_session_id: string | null;
  created_at: string;
}

export interface TimeBlock {
  start: string; // HH:MM
  end: string; // HH:MM
}

export interface AvailabilityRow {
  weekday: number; // 0=Sun, 6=Sat
  enabled: boolean;
  blocks: TimeBlock[];
}

export interface TimeSlot {
  start: string; // HH:MM
  end: string; // HH:MM
}

export interface BookingFormData {
  playerName: string;
  playerEmail: string;
  playerPhone: string;
}

export type BookingStep = "date" | "duration" | "time" | "form";

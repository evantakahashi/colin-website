export const TIMEZONE = "America/Los_Angeles";

export const PRICING: Record<number, number> = {
  60: 100,
  90: 125,
};

export const DURATIONS = [60, 90] as const;
export type Duration = (typeof DURATIONS)[number];

export const VENMO_HANDLE = "@your-handle";
export const ZELLE_INFO = "your@email.com";

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

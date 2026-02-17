export const TIMEZONE = "America/Los_Angeles";

export const PRICING: Record<number, number> = {
  60: 50,
  90: 75,
};

export const ORIGINAL_PRICING: Record<number, number> = {
  60: 75,
  90: 100,
};

export const DURATIONS = [60, 90] as const;
export type Duration = (typeof DURATIONS)[number];

export interface Location {
  id: string;
  name: string;
  address: string;
}

export const LOCATIONS: Location[] = [
  { id: "union-ms", name: "Union Middle School", address: "2130 Los Gatos Almaden Rd, San Jose, CA 95124" },
];


export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

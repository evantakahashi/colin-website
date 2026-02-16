# Location Selector Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add location selection step between date and duration in booking flow, stored with booking.

**Architecture:** Add `LOCATIONS` constant, new `LocationSelector` component mirroring `DurationSelector` style, insert `"location"` step into `useBookingFlow` state machine, pass location through to checkout API and Supabase.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Supabase, Stripe

---

### Task 1: Add location constants and types

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/lib/types.ts`

**Step 1: Add LOCATIONS to constants.ts**

After line 14 (`export type Duration = ...`), add:

```ts
export interface Location {
  id: string;
  name: string;
  address: string;
}

export const LOCATIONS: Location[] = [
  { id: "union-ms", name: "Union Middle School", address: "2130 Los Gatos Almaden Rd, San Jose, CA 95124" },
];
```

**Step 2: Update BookingStep type in types.ts**

Replace line 37:
```ts
export type BookingStep = "date" | "duration" | "time" | "form";
```
With:
```ts
export type BookingStep = "date" | "location" | "duration" | "time" | "form";
```

**Step 3: Add location to Booking interface in types.ts**

After line 9 (`duration_minutes: number;`), add:
```ts
  location: string | null;
```

**Step 4: Commit**
```bash
git add src/lib/constants.ts src/lib/types.ts
git commit -m "add location types and constants"
```

---

### Task 2: Update useBookingFlow hook

**Files:**
- Modify: `src/hooks/useBookingFlow.ts`

**Step 1: Add location state and update flow**

Replace entire file with:

```ts
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
```

**Step 2: Commit**
```bash
git add src/hooks/useBookingFlow.ts
git commit -m "add location step to booking flow hook"
```

---

### Task 3: Create LocationSelector component

**Files:**
- Create: `src/components/landing/LocationSelector.tsx`

**Step 1: Create component**

Model after `DurationSelector.tsx`. Single tappable card with MapPin icon.

```tsx
"use client";

import { LOCATIONS, Location } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface LocationSelectorProps {
  selected?: Location;
  onSelect: (location: Location) => void;
}

export default function LocationSelector({ selected, onSelect }: LocationSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-slate-400" />
        Select Location
      </h3>
      <div className="flex flex-col gap-3">
        {LOCATIONS.map((loc) => (
          <motion.button
            key={loc.id}
            onClick={() => onSelect(loc)}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg text-left transition-all duration-200 cursor-pointer ${
              selected?.id === loc.id
                ? "bg-white ring-2 ring-brand-400"
                : "bg-brand-600 hover:bg-brand-500"
            }`}
          >
            <span className={`text-base font-semibold ${selected?.id === loc.id ? "text-brand-600" : "text-white"}`}>
              {loc.name}
            </span>
            <p className={`text-sm mt-1 ${selected?.id === loc.id ? "text-brand-500/70" : "text-brand-100/70"}`}>
              {loc.address}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/landing/LocationSelector.tsx
git commit -m "create LocationSelector component"
```

---

### Task 4: Wire location step into BookingFlow

**Files:**
- Modify: `src/components/landing/BookingFlow.tsx`

**Step 1: Add import**

After line 7 (`import TimeSlotGrid from "./TimeSlotGrid";`), add:
```tsx
import LocationSelector from "./LocationSelector";
```

Update constants import (line 11) to include `LOCATIONS`:
```tsx
import { TIMEZONE, LOCATIONS } from "@/lib/constants";
```

**Step 2: Destructure new hook values**

Replace lines 23-33 to include `selectedLocation` and `selectLocation`:
```tsx
  const {
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
  } = useBookingFlow();
```

**Step 3: Update progress bar steps**

Replace lines 155-156:
```ts
  const steps = ["date", "duration", "time", "form"] as const;
  const stepLabels = ["Date", "Length", "Time", "Book"] as const;
```
With:
```ts
  const steps = ["date", "location", "duration", "time", "form"] as const;
  const stepLabels = ["Date", "Location", "Length", "Time", "Book"] as const;
```

**Step 4: Add location to breadcrumb trail**

After the selectedDate breadcrumb span (around line 193), add location breadcrumb:
```tsx
          {selectedLocation && (
            <>
              <span>→</span>
              <span className="px-2 py-0.5 bg-white/5 rounded text-slate-300">{selectedLocation.name}</span>
            </>
          )}
```

**Step 5: Add location step in AnimatePresence**

After the date step's closing `)}` (after line 228), add:
```tsx
        {step === "location" && (
          <motion.div
            key="location"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderBackButton("date")}
            <LocationSelector selected={selectedLocation} onSelect={selectLocation} />
          </motion.div>
        )}
```

**Step 6: Update duration back button**

Change the duration step's back button from `renderBackButton("date")` to:
```tsx
            {renderBackButton("location")}
```

**Step 7: Pass location to handleCheckout**

In the `handleCheckout` fetch body (around line 119-125), add `location`:
```ts
        body: JSON.stringify({
          ...data,
          date: dateStr,
          startTime: selectedTime,
          endTime,
          duration: selectedDuration,
          location: selectedLocation?.id,
        }),
```

**Step 8: Add location to BookingForm props**

Update the BookingForm render (around line 274-281) to pass location:
```tsx
            <BookingForm
              date={dateStr}
              startTime={selectedTime!}
              endTime={endTime}
              duration={selectedDuration!}
              location={selectedLocation!}
              onSubmit={handleCheckout}
              loading={checkoutLoading}
            />
```

**Step 9: Commit**
```bash
git add src/components/landing/BookingFlow.tsx
git commit -m "wire location step into booking flow"
```

---

### Task 5: Update BookingForm to show location

**Files:**
- Modify: `src/components/landing/BookingForm.tsx`

**Step 1: Add Location import and prop**

Add to imports:
```tsx
import { Duration, PRICING, Location } from "@/lib/constants";
```

Add `location: Location` to `BookingFormProps` interface.

**Step 2: Add location to summary display**

In the session summary div (after the date line, around line 39), add:
```tsx
        <p className="text-slate-300">{location.name} — {location.address}</p>
```

**Step 3: Destructure location prop**

Add `location` to the destructured props.

**Step 4: Commit**
```bash
git add src/components/landing/BookingForm.tsx
git commit -m "show location in booking form summary"
```

---

### Task 6: Update ConfirmationCard to show location

**Files:**
- Modify: `src/components/landing/ConfirmationCard.tsx`

**Step 1: Import LOCATIONS**

```tsx
import { VENMO_HANDLE, ZELLE_INFO, LOCATIONS } from "@/lib/constants";
```

**Step 2: Add location line to confirmation details**

After the Date line (around line 48), add:
```tsx
          {booking.location && (() => {
            const loc = LOCATIONS.find(l => l.id === booking.location);
            return loc ? (
              <p className="text-slate-300"><span className="font-medium text-white">Location:</span> {loc.name} — {loc.address}</p>
            ) : null;
          })()}
```

**Step 3: Commit**
```bash
git add src/components/landing/ConfirmationCard.tsx
git commit -m "show location in booking confirmation"
```

---

### Task 7: Update checkout API

**Files:**
- Modify: `src/app/api/checkout/route.ts`

**Step 1: Accept location field**

Update the destructure (line 11) to include `location`:
```ts
    const { playerName, playerEmail, playerPhone, date, startTime, endTime, duration, location } = body;
```

**Step 2: Add location to booking insert**

In the `.insert()` call (around line 58-67), add:
```ts
        location: location || null,
```

**Step 3: Include location in Stripe product description**

Update the product description (line 84):
```ts
              description: `${date} at ${startTime} (Pacific)${location ? ` — ${location}` : ""}`,
```

**Step 4: Commit**
```bash
git add src/app/api/checkout/route.ts
git commit -m "accept and store location in checkout"
```

---

### Task 8: Add Supabase column + build verification

**Step 1: Add location column to Supabase**

Run in Supabase SQL editor (or dashboard):
```sql
ALTER TABLE bookings ADD COLUMN location TEXT;
```

Note: This must be done manually in the Supabase dashboard. Inform the user.

**Step 2: Run build**
```bash
npm run build
```
Expected: Clean build, no errors.

**Step 3: Commit any fixes if needed**
```bash
git add -A
git commit -m "fix any build issues from location selector"
```

---

## Unresolved Questions

- None

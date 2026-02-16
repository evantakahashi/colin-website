# Location Selector Design

**Goal:** Add location selection step between date and duration in booking flow. Store location with booking.

## Location Data

```ts
LOCATIONS = [
  { id: "union-ms", name: "Union Middle School", address: "2130 Los Gatos Almaden Rd, San Jose, CA 95124" }
]
```

## Flow

Date → **Location** → Length → Time → Book (5 steps)

## Components

- **`LocationSelector.tsx`** — New. Matches `DurationSelector` card style. MapPin icon, tappable card with name + address. Single location but requires tap to proceed.

## Data Changes

- **`constants.ts`** — Add `LOCATIONS` array and `Location` type
- **`types.ts`** — Add `"location"` to `BookingStep`, add `location` field to `Booking`
- **`useBookingFlow.ts`** — Add `selectedLocation` state. `selectDate` → `"location"`. New `selectLocation` → `"duration"`.

## Backend

- **Checkout API** — Accept `location` field, store in booking insert
- **Supabase** — `location TEXT` column on `bookings` table
- **Stripe** — Include location in product description

## Display Updates

- **BookingForm** — Show location in session summary
- **ConfirmationCard** — Show location in confirmation details
- **BookingFlow progress bar** — 5 steps: Date / Location / Length / Time / Book

# Launch Banner Design

**Goal:** Add a launch special banner at the very top of the home page (above navbar) to drive bookings.

## Banner Spec
- Full-width amber strip (~36-40px tall), sits above navbar, scrolls away naturally
- Copy: "Launch Special - Limited spots at discounted pricing"
- Entire strip is a link to `#booking`
- Right arrow/chevron hint for clickability
- Not dismissable — always visible
- Amber background (`bg-amber-500/90`) with white/dark text for contrast
- Subtle hover brightness change

## Placement
Rendered before `<Navbar />` in `src/app/page.tsx`.

## Files
- Create: `src/components/landing/LaunchBanner.tsx`
- Modify: `src/app/page.tsx` (import + render before Navbar)

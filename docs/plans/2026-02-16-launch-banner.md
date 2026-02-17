# Launch Banner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a full-width amber launch special banner above the navbar on the home page that links to the booking section.

**Architecture:** New `LaunchBanner` component rendered before `<Navbar />` in `page.tsx`. Simple static component, no state needed.

**Tech Stack:** React, Tailwind CSS, lucide-react (ChevronRight icon)

---

### Task 1: Create LaunchBanner component

**Files:**
- Create: `src/components/landing/LaunchBanner.tsx`

**Step 1: Create the component**

```tsx
import { ChevronRight } from "lucide-react";

export default function LaunchBanner() {
  return (
    <a
      href="#booking"
      className="block w-full bg-amber-500/90 hover:bg-amber-500 transition-colors py-2 px-4 text-center"
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-black">
        Launch Special — Limited spots at discounted pricing
        <ChevronRight className="w-4 h-4" />
      </span>
    </a>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/LaunchBanner.tsx
git commit -m "add launch banner component"
```

---

### Task 2: Render banner in page.tsx

**Files:**
- Modify: `src/app/page.tsx:1-10`

**Step 1: Add import and render before Navbar**

Add import at top:
```tsx
import LaunchBanner from "@/components/landing/LaunchBanner";
```

Render before `<Navbar />`:
```tsx
<main id="main" className="min-h-screen pitch-bg">
  <LaunchBanner />
  <Navbar />
```

**Step 2: Verify visually**

Run: `npm run dev`
Expected: Amber banner strip at top of page, above navbar. Clicking it scrolls to booking section.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "render launch banner above navbar on home page"
```

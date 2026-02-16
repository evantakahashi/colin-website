# Logo & Color Scheme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add CT19 Training logo to navbar, replace site-wide Tailwind blue palette with logo-derived brand colors.

**Architecture:** Define brand colors in Tailwind v4 `@theme inline`, then find-replace all `blue-*` class references with `brand-*` equivalents. Replace navbar text logo with `<img>` element.

**Tech Stack:** Next.js 16, Tailwind CSS v4 (`@theme inline`), React 19

---

## Color Reference

| Tailwind Token | Hex | Role |
|---|---|---|
| `brand-600` | `#0D5EAF` | Primary buttons, active states, fills |
| `brand-500` | `#1A6FBF` | Hover states |
| `brand-400` | `#6ECFFF` | Badge text, accent highlights |
| `brand-100` | `#B8E4FF` | Muted text (used with /70 opacity) |

Hardcoded hex replacements (in globals.css calendar overrides):
- `#2563eb` → `#0D5EAF`
- `rgba(37, 99, 235, …)` → `rgba(13, 94, 175, …)`

---

### Task 1: Define brand colors in theme & update globals.css

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Update `@theme inline` block**

Replace lines 4-7:
```css
  --color-primary: #2563eb;
  --color-primary-light: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-accent: #2563eb;
```
With:
```css
  --color-primary: #0D5EAF;
  --color-primary-light: #1A6FBF;
  --color-primary-dark: #094A8C;
  --color-accent: #6ECFFF;
  --color-brand-600: #0D5EAF;
  --color-brand-500: #1A6FBF;
  --color-brand-400: #6ECFFF;
  --color-brand-100: #B8E4FF;
```

**Step 2: Update calendar overrides**

All hardcoded `#2563eb` → `#0D5EAF` (lines 65, 66, 71, 107, 115, 117, 123, 124)

All `rgba(37, 99, 235, ...)` → `rgba(13, 94, 175, ...)` (lines 66, 107, 117)

**Step 3: Commit**
```bash
git add src/app/globals.css
git commit -m "update theme colors to brand palette"
```

---

### Task 2: Add logo to Navbar

**Files:**
- Modify: `src/components/landing/Navbar.tsx`

**Step 1: Replace text logo with image**

Replace line 55-57:
```tsx
<a href="/" onClick={handleLogoClick} className="text-xl font-bold text-white tracking-tight select-none">
  CT <span className="text-blue-500">Training</span>
</a>
```
With:
```tsx
<a href="/" onClick={handleLogoClick} className="select-none shrink-0">
  <img src="/logo.png" alt="CT19 Training" className="h-10 w-auto" />
</a>
```

**Step 2: Update blue classes in Navbar**

Replace all `blue-600` → `brand-600` and `blue-500` → `brand-500` in:
- Line 76: `bg-blue-600 hover:bg-blue-500` → `bg-brand-600 hover:bg-brand-500`
- Line 113: same replacement

**Step 3: Commit**
```bash
git add src/components/landing/Navbar.tsx
git commit -m "add logo to navbar, update brand colors"
```

---

### Task 3: Update HeroSection

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

**Step 1: Replace all blue-* classes**

Line 34: `bg-blue-600/10 border border-blue-500/20 text-blue-400` → `bg-brand-600/10 border border-brand-500/20 text-brand-400`

Line 45: `text-blue-500` → `text-brand-500`

Line 59: `bg-blue-600 hover:bg-blue-500` → `bg-brand-600 hover:bg-brand-500`

Line 101: `bg-blue-600/10` → `bg-brand-600/10`

**Step 2: Commit**
```bash
git add src/components/landing/HeroSection.tsx
git commit -m "update hero section brand colors"
```

---

### Task 4: Update AboutSection

**Files:**
- Modify: `src/components/landing/AboutSection.tsx`

**Step 1: Replace all blue-* classes**

Line 20: `bg-blue-600/10 border border-blue-500/20 text-blue-400` → `bg-brand-600/10 border border-brand-500/20 text-brand-400`

Line 61: `bg-blue-600/10` → `bg-brand-600/10`

Line 70: `bg-blue-600/10 border border-blue-500/20 text-blue-400` → `bg-brand-600/10 border border-brand-500/20 text-brand-400`

**Step 2: Commit**
```bash
git add src/components/landing/AboutSection.tsx
git commit -m "update about section brand colors"
```

---

### Task 5: Update ContactSection

**Files:**
- Modify: `src/components/landing/ContactSection.tsx`

**Step 1: Replace all blue-* classes**

Line 47: `from-blue-600/10` → `from-brand-600/10`

Line 67: `bg-blue-600/10 border border-blue-500/20 text-blue-400` → `bg-brand-600/10 border border-brand-500/20 text-brand-400`

Lines 84, 101, 117, 134: `focus:ring-blue-600` → `focus:ring-brand-600`

Line 141: `bg-blue-600 hover:bg-blue-500` → `bg-brand-600 hover:bg-brand-500`

Line 161: `bg-blue-600/10 border border-blue-500/20 text-blue-400` → `bg-brand-600/10 border border-brand-500/20 text-brand-400`

Line 166: `text-blue-500` → `text-brand-500`

Line 173: `text-blue-500` → `text-brand-500`

Line 176: `hover:text-blue-400` → `hover:text-brand-400`

Line 186: `bg-blue-600/10 border border-blue-500/20 text-blue-400` → `bg-brand-600/10 border border-brand-500/20 text-brand-400`

**Step 2: Commit**
```bash
git add src/components/landing/ContactSection.tsx
git commit -m "update contact section brand colors"
```

---

### Task 6: Update ContentSection

**Files:**
- Modify: `src/components/landing/ContentSection.tsx`

**Step 1: Replace blue hover effects**

Line 103: `group-hover:border-blue-500/30 ... group-hover:shadow-blue-500/10` → `group-hover:border-brand-500/30 ... group-hover:shadow-brand-500/10`

**Step 2: Commit**
```bash
git add src/components/landing/ContentSection.tsx
git commit -m "update content section brand colors"
```

---

### Task 7: Update BookingFlow + BookingForm

**Files:**
- Modify: `src/components/landing/BookingFlow.tsx`
- Modify: `src/components/landing/BookingForm.tsx`

**Step 1: BookingFlow — replace blue classes**

Line 166: `border-blue-500` → `border-brand-500`

Line 168: `text-blue-400` → `text-brand-400`

**Step 2: BookingForm — replace blue classes**

Line 37: `bg-blue-600/10 border border-blue-500/20` → `bg-brand-600/10 border border-brand-500/20`

Line 38: `text-blue-400` → `text-brand-400`

**Step 3: Commit**
```bash
git add src/components/landing/BookingFlow.tsx src/components/landing/BookingForm.tsx
git commit -m "update booking flow brand colors"
```

---

### Task 8: Update DurationSelector + TimeSlotGrid

**Files:**
- Modify: `src/components/landing/DurationSelector.tsx`
- Modify: `src/components/landing/TimeSlotGrid.tsx`

**Step 1: DurationSelector**

Line 32: `ring-blue-400` → `ring-brand-400`
Line 33: `bg-blue-600 hover:bg-blue-500` → `bg-brand-600 hover:bg-brand-500`
Line 36: `text-blue-600` → `text-brand-600`
Line 39: `text-blue-500/70` (selected) → `text-brand-500/70`, `text-blue-100/70` (unselected) → `text-brand-100/70`

**Step 2: TimeSlotGrid**

Line 68: `text-blue-600 ring-2 ring-blue-400` → `text-brand-600 ring-2 ring-brand-400`
Line 69: `bg-blue-600 text-white hover:bg-blue-500` → `bg-brand-600 text-white hover:bg-brand-500`

**Step 3: Commit**
```bash
git add src/components/landing/DurationSelector.tsx src/components/landing/TimeSlotGrid.tsx
git commit -m "update selector/timeslot brand colors"
```

---

### Task 9: Update UI primitives

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/ui/Input.tsx`

**Step 1: Button**

Line 16: `bg-blue-600 hover:bg-blue-500` → `bg-brand-600 hover:bg-brand-500`

**Step 2: Input**

Line 14: `focus:ring-blue-600` → `focus:ring-brand-600`

**Step 3: Commit**
```bash
git add src/components/ui/Button.tsx src/components/ui/Input.tsx
git commit -m "update UI primitives brand colors"
```

---

### Task 10: Update coach portal & remaining pages

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/coach-portal/login/page.tsx`
- Modify: `src/app/booking/success/page.tsx`
- Modify: `src/components/coach/DayToggle.tsx`
- Modify: `src/components/coach/TimeBlockEditor.tsx`

**Step 1: layout.tsx**

Line 29: `focus:bg-blue-600` → `focus:bg-brand-600`

**Step 2: coach-portal/login/page.tsx**

Line 40: `text-blue-500` → `text-brand-500`
Line 54: `focus:ring-blue-600` → `focus:ring-brand-600`
Line 68: `focus:ring-blue-600` → `focus:ring-brand-600`
Line 80: `bg-blue-600 ... hover:bg-blue-500` → `bg-brand-600 ... hover:bg-brand-500`

**Step 3: booking/success/page.tsx**

Line 69: `text-blue-500` → `text-brand-500`
Line 81: `text-blue-500 hover:text-blue-400` → `text-brand-500 hover:text-brand-400`
Line 94: `text-blue-500 hover:text-blue-400` → `text-brand-500 hover:text-brand-400`
Line 108: `text-blue-500` → `text-brand-500`

**Step 4: DayToggle.tsx**

Line 17: `bg-blue-600 text-white border-blue-600` → `bg-brand-600 text-white border-brand-600`

**Step 5: TimeBlockEditor.tsx**

Line 54: `text-blue-500 hover:text-blue-400` → `text-brand-500 hover:text-brand-400`

**Step 6: Commit**
```bash
git add src/app/layout.tsx src/app/coach-portal/login/page.tsx src/app/booking/success/page.tsx src/components/coach/DayToggle.tsx src/components/coach/TimeBlockEditor.tsx
git commit -m "update remaining pages brand colors"
```

---

### Task 11: Build verification

**Step 1: Run build**
```bash
npm run build
```
Expected: Clean build, no errors.

**Step 2: Run dev server and spot-check**
```bash
npm run dev
```
Verify: Navbar shows logo, all blues now match logo palette.

**Step 3: Final commit (if any fixes needed)**
```bash
git add -A
git commit -m "fix any build issues from brand color migration"
```

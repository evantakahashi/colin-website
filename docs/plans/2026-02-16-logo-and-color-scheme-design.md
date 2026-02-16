# Logo & Color Scheme Update

## Goal
Add CT19 Training logo to navbar, update site-wide blue palette to match logo colors.

## Logo
- File: `public/logo.png`
- Placement: Navbar only, replacing text "CT Training"
- Size: ~40px tall within 64px nav height

## Color Mapping

| Current | Hex | Usage | New Hex | Source |
|---------|-----|-------|---------|--------|
| blue-600 | #2563eb | Buttons, primary bg | #0D5EAF | Logo dark blue |
| blue-500 | #3b82f6 | Hover states, accent | #1A6FBF | Lighter dark blue |
| blue-400 | #60a5fa | Badge text, light accent | #6ECFFF | Logo sky blue |
| blue-600/10 | — | Background tints | #0D5EAF/10 | — |
| blue-500/20 | — | Border accents | #0D5EAF/20 | — |
| blue-100/70 | — | Muted text | #6ECFFF/70 | — |

## CSS Variables Update
```css
--color-primary: #0D5EAF;
--color-primary-light: #1A6FBF;
--color-primary-dark: #094A8C;
--color-accent: #6ECFFF;
```

## Files to Modify
1. `src/app/globals.css` — CSS variables + calendar styles
2. `src/components/landing/Navbar.tsx` — logo image
3. All files with `blue-*` Tailwind classes (~15 files)

## Implementation Plan
1. Update CSS variables in globals.css
2. Add Tailwind custom colors via theme config or arbitrary values
3. Replace logo text in Navbar with `<img>`
4. Find-and-replace blue-* classes across all components
5. Verify visual consistency

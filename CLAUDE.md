# Project: darce.xyz

Personal portfolio site for Daniel Arcé. Next.js (Pages Router), SCSS modules, MDX content.

Agent-agnostic design documentation lives in `/agentic/`. See `/agentic/CONTRACT.md` for the index.

## Design Philosophy

Hard-edge aesthetic: sharp borders, zero border-radius, dithered patterns, functional typography, precision over softness. Restraint means placing accents precisely, not eliminating them — every page should have visual energy through purposeful interaction and color.

### Visual System

- **Borders:** `$s-line` (1px) for interactive card/link borders. Decorative accent strokes (nav underline, dividers) use 2px.
- **Shadows:** Dithered checkerboard via `@include ditheredShadow` mixin, never `box-shadow`. Uses `repeating-conic-gradient` — pure CSS.
- **Color:** Coral accent (`t('border')`) on hover states. Link color (`t('link')`) is the default interactive color. Theme tokens via `t()` inside `@include themeComponent($themes)`.
- **Typography:** GeistMono (monospace), Roboto Flex (headings). Weight via `font-variation-settings`.
- **External links:** `href^="http"` and `mailto:` within `#main-content` get a northeast arrow icon via global CSS.

### Dithered Shadow Pattern

Requires a **two-layer DOM**:
1. **Outer** — transparent background, `position: relative`, owns `::after` dither
2. **Inner** — opaque `background-color: t('background')`, `overflow: hidden`

Use `DitheredCard` component for links. For non-link elements, use the mixin directly with a child providing the opaque background.

### Spacing

Derives from `$s: 2px` in `styles/spacing.scss`:
- `$s-small`: 6px | `$s-medium`: 12px | `$s-large`: 24px | `$s-x-large`: 48px | `$s-line`: 1px

### Layout (Mobile)

- `.content` owns horizontal padding (`0 $s-large`)
- Full-bleed children break out with `margin-left/right: -$s-large` then re-apply `padding: $s-large`

### Theme

Dual light/dark in `styles/palettes.scss`. `ThemeToggle` renders a 2×2 palette swatch that updates automatically.

### Navigation

- Top nav: horizontal links, underline accent, font-weight active state
- Breadcrumb: page title with prev/next arrows (mobile)
- Sub-nav: prev/next DitheredCards at bottom of detail pages (mobile, full-bleed)
- Swipe: `useSwipeNav` hook for touch between siblings

### Content

- MDX in `content/{projects,research}/` with Zod-validated frontmatter
- Thumbnail `position` and `scale` fields for per-image crop control
- MDX `<hr>` suppressed; article dividers rendered by `ProjectDetails`

## Commands

- `npm run dev` — dev server
- `npx next build` — production build

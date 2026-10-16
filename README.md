# Website Template

A reusable, modern, responsive website template with a consistent design
system (colors, typography, spacing), built with plain HTML, CSS and
JavaScript and bundled with [Vite](https://vitejs.dev/).

## Sections

- Header with logo and primary navigation (with a mobile hamburger toggle)
- Hero section with heading, subtitle and call-to-action button
- Features section with reusable card components
- About section
- Call-to-action band
- Footer with secondary links

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Tests

```bash
npm test
```

Tests (in `tests/`) cover:

- Page structure: header/nav, hero, content/cards, CTA, footer, and that
  every link points to a real in-page section (no dead `#` links).
- Mobile nav toggle behaviour: opening, closing, and closing on link click.

## Design system

Colors, typography and spacing are defined as CSS custom properties in
`src/css/style.css` (`:root`), and reused by every component so the whole
site stays visually consistent.

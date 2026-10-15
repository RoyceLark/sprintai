# Website Template

A reusable, modern, responsive website template built with plain HTML, CSS,
and JavaScript (bundled with [Vite](https://vitejs.dev)). It provides a
consistent design system (colors, typography, spacing) and ready-to-use
sections: header/navigation, hero, content sections, call-to-action, and
footer - all responsive across desktop, tablet, and mobile.

## Structure

- `index.html` - page markup (header, nav, hero, features, about, CTA, footer).
- `src/css/style.css` - design tokens (CSS custom properties) and responsive
  layout rules (breakpoints for tablet at 1024px and mobile at 768px).
- `src/js/nav.js` - mobile navigation toggle logic (exported for testing).
- `src/js/main.js` - app entry point, wires up the navigation.
- `tests/` - Vitest tests covering page structure and nav behaviour.

## Install

```bash
npm install
```

## Run (development server)

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Test

```bash
npm test
```

Tests run with [Vitest](https://vitest.dev) in a jsdom environment and cover:

- Presence of required sections (header/nav, hero, content, CTA, footer).
- Navigation links, skip link, and ARIA attributes for accessibility.
- Mobile navigation toggle open/close behaviour.

## Notes

- Manual responsive/functional QA across real devices and product-owner
  sign-off are outside the scope of automated tests and should be done as
  part of review before this ticket is closed.

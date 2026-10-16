# Rich Salon Website

A static marketing website for Rich Salon: Home, About Us, Services, Pricing, Gallery, Testimonials and Contact sections on a single responsive page, with an appointment enquiry form that is validated client-side.

## Project structure

- `index.html` - page markup (all sections)
- `css/style.css` - styles, including responsive breakpoints
- `js/script.js` - navigation (mobile menu toggle, active-link highlighting)
- `js/validation.js` - appointment form validation logic (pure functions, reused by tests and the browser)
- `tests/` - unit tests (Node's built-in test runner)

## Install

No dependencies are required to run the site; it is plain HTML/CSS/JS.

```
npm install
```

## Run

Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.

```
npx http-server .
```

## Test

```
npm test
```

Runs the unit tests in `tests/` with Node's built-in test runner (`node --test`).

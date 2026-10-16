# Rich Salon Website

A modern, responsive static website for Rich Salon, built with plain HTML, CSS and JavaScript.

## Sections

- Home (hero)
- About Us
- Services (with a special offer banner)
- Pricing (responsive table)
- Gallery and customer testimonials
- Contact & appointment enquiry form (client-side validated)

## Running locally

This is a static site with no build step. Open `index.html` directly in a browser, or serve it with any static server, e.g.:

```bash
npx serve .
```

## Tests

End-to-end tests (Playwright) live in `e2e/`. See `e2e/README.md` for how to install and run them:

```bash
cd e2e
npm install
npm test
```

The suite checks that all sections render, navigation (including the mobile menu) works, the pricing table and gallery/testimonials render, and the enquiry form validates required fields/email format and shows a success message on valid submission.

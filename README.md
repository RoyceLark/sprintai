# Rich Salon Website

A modern, responsive marketing website for Rich Salon, built with plain HTML, CSS and JavaScript.
It showcases the salon's Home, About Us, Services, Pricing, Gallery (with testimonials) and Contact
sections, including a client-side validated appointment enquiry form.

## Project structure

```
index.html          Single-page site with all sections (Home, About, Services, Pricing, Gallery, Contact)
css/styles.css       All styling, including responsive layout (desktop/tablet/mobile)
js/validation.js     Pure, framework-free validation logic for the enquiry form (also unit tested)
js/main.js           DOM behaviour: mobile nav toggle, active link highlighting, form submit handling
js/__tests__/        Jest unit tests for js/validation.js
```

## Running the website

No build step is required. Open `index.html` directly in a browser, or serve it locally:

```bash
npx http-server .
```

## Running the tests

```bash
npm install
npm test
```

Tests cover the appointment enquiry form's validation rules (name, email, phone, service), including
boundary and invalid-input cases.

## Notes

- The appointment enquiry form is validated and handled entirely client-side (no backend exists yet);
  on a successful submission it shows a confirmation message instead of sending data anywhere.
- Gallery images use colored placeholder blocks; swap in real photos under an `images/` folder when available.

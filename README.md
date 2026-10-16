# Rich Salon Website

A modern, responsive single-page marketing website for Rich Salon, built with plain HTML, CSS and JavaScript (no framework).

## Features

- Home, About Us, Services, Pricing, Gallery, Testimonials and Contact sections on one semantic page.
- Sticky nav bar with smooth-scrolling links, a collapsible mobile menu, and scroll-based active-link highlighting.
- Services and Pricing shown as card grids; Gallery shown as a responsive image grid.
- Testimonials rendered as always-visible static cards (no JS slider hiding content).
- Appointment enquiry form (Name, Email/Phone, Service, Date, Message) with accessible labels and client-side validation.
- Responsive layout for desktop (>=1024px), tablet (~768px) and mobile (<=480px).

## Project structure

```
index.html        Page markup (all sections)
css/style.css      Styles and responsive layout
js/script.js       Nav toggle, active-link highlighting, form wiring
js/validation.js   Pure validation functions (shared by the browser and tests)
images/            SVG icons and gallery placeholders
tests/             Jest unit tests
```

## Install

```
npm install
```

## Run

Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.:

```
npx http-server .
```

## Test

```
npm test
```

Runs Jest unit tests covering the form validation logic and the HTML structure (sections, nav links, services, pricing, gallery, testimonials, contact form).

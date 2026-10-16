# Bella Salon Website

A static HTML/CSS salon website with a simple admin dashboard page.

## Structure

- `index.html` - public salon homepage (services, about, contact).
- `admin-dashboard.html` - admin dashboard page showing booking summary and recent bookings (static sample data).
- `css/styles.css` - shared stylesheet for all pages.
- `e2e/` - end-to-end tests (Playwright) for the pages above.

## Running the site

Open `index.html` in a browser, or serve the folder with any static file server, e.g.:

```bash
npx http-server .
```

Then visit the printed URL, and use the "Admin" link in the navigation to reach `admin-dashboard.html`.

## Running tests

See `e2e/README.md` for how to install and run the end-to-end tests.

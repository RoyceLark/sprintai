# E2E tests

End-to-end tests for the Bella Salon static website, using [Playwright](https://playwright.dev/).

## Install

```bash
cd e2e
npm install
npx playwright install --with-deps chromium
```

## Run

```bash
npm test
```

The tests open the static HTML pages (`index.html`, `admin-dashboard.html`) directly from disk via `file://` URLs, so no dev server is required.

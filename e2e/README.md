# Rich Salon E2E Tests

Playwright tests that open `index.html` directly (file://) and verify the Rich Salon site.

## Install

```bash
npm install
npx playwright install --with-deps chromium
```

## Run

```bash
npm test
```

Uses the `list` reporter so pass/fail counts are printed for each test.

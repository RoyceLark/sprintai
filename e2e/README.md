# Browser tests

End-to-end tests for this application, written with [Playwright](https://playwright.dev). AI SprintFlow created
this project for SCRUM-16 and adds the browser tests of later tickets under `tests/sprintflow/`; you can add
your own tests anywhere under `tests/`.

## Run the tests

```
cd e2e
npm install
npx playwright install chromium
npm test
```

The tests start the app themselves (`npx http-server (the site's folder)`) at http://127.0.0.1:5510. To test an app that
is already running somewhere else, set `BASE_URL`, e.g. `BASE_URL=https://staging.example.com npm test`.

Other commands: `npm run test:headed` (watch the browser), `npm run test:ui` (Playwright's UI mode),
`npm run report` (open the last HTML report).

Each SprintFlow test imports `./sprintflow-proof`: it records a high-resolution video and captions each step, which
SprintFlow attaches to the Jira ticket as evidence. In a normal run it only adds a little disk use under
`test-results/`.

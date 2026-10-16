// Browser tests for this repository (Playwright), created by AI SprintFlow.
// Run them: npm install, npx playwright install chromium, npm test  (see README.md)
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || "http://127.0.0.1:5510";

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Starts the app for the tests; set BASE_URL to test an app that is already running instead.
  webServer: process.env.BASE_URL ? undefined : {
    command: "npx --yes http-server . -p 5510 -a 127.0.0.1 -c-1 -s",
    cwd: path.resolve(__dirname, ".."),
    url: new URL("/", baseURL).toString(),
    reuseExistingServer: true,
    timeout: 240000,
    env: {
    },
  },
});

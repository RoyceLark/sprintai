// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    headless: true,
    baseURL: process.env.SPRINTFLOW_BASE_URL || 'http://127.0.0.1:5510',
  },
  webServer: {
    command: 'npx http-server .. -p 5510 -c-1 -s',
    port: 5510,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});

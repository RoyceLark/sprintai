import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'node static-server.js',
    url: 'http://localhost:4321/index.html',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});

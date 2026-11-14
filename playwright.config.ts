// This configuration will:
// - Start your Next.js application automatically if needed.
// - Test desktop and mobile browser layouts.
// - Capture screenshots and videos when tests fail.
// - Generate an HTML report.

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: 0,
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  outputDir: 'test-results',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        headless: false,
        viewport: { width: 1366, height: 768 },
        launchOptions: { slowMo: 500 },
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

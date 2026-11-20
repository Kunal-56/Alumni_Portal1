import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./Alumni_portal(functional testing/02_Functional_Testing/Automation/tests",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: "list",
  outputDir: "test-results/functional-remediation",
  use: {
    baseURL: "http://127.0.0.1:3101",
    browserName: "chromium",
    headless: true,
  },
});

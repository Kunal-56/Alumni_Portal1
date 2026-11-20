import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/security",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  reporter: "list",
  outputDir: "test-results/security-functional-remediation",
  use: {
    baseURL: "http://127.0.0.1:3101",
    browserName: "chromium",
    headless: true,
  },
});

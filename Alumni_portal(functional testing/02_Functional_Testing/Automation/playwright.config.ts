import { defineConfig, devices } from "@playwright/test";
import path from "path";

const projectRoot = path.resolve(__dirname, "../..");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: path.resolve(projectRoot, "Evidence/test-results"),
  reporter: [
    ["list"],
    ["html", { outputFolder: path.resolve(projectRoot, "Evidence/HTML_Report"), open: "never" }]
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  projects: [
    {
      name: "functional-api",
      testMatch: "**/api/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "functional-browser",
      testMatch: "**/browser/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"], headless: false, launchOptions: { slowMo: 350 } }
    }
  ],
});

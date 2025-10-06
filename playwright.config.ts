import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:8787";
const junitOutputFile =
  process.env.PLAYWRIGHT_JUNIT_OUTPUT_NAME ??
  "reports/playwright/results.xml";
const htmlReporterOptions = {
  outputFolder: "playwright-report",
  open: process.env.CI ? "never" : "on-failure",
};
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: isCI
    ? [["line"], ["junit", { outputFile: junitOutputFile }], ["html", htmlReporterOptions]]
    : [["list"], ["html", htmlReporterOptions]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run cf:dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 4 * 60 * 1000,
    stdout: "pipe",
    stderr: "pipe",
  },
  projects: [
    {
      name: "integration",
      testDir: "./tests/integration",
      testMatch: "**/*.spec.ts",
    },
    {
      name: "e2e",
      testDir: "./tests/e2e",
      testMatch: "**/*.e2e.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});

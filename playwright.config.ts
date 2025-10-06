import { defineConfig, devices } from '@playwright/test';

const webServerCommand = 'npm run cf:dev';
const webServerPort = 8787;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: process.env.CI
    ? [['junit', { outputFile: process.env.PLAYWRIGHT_JUNIT_OUTPUT_NAME ?? 'playwright-results.xml' }], ['list']]
    : 'list',
  webServer: {
    command: webServerCommand,
    port: webServerPort,
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
  },
  use: {
    baseURL: `http://127.0.0.1:${webServerPort}`,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'integration',
      testDir: './tests/integration',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      testMatch: '**/*.e2e.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

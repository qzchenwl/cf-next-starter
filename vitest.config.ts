import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const cwd =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const baseTestConfig = {
  globals: true,
  environment: "jsdom",
  setupFiles: ["./vitest.setup.ts"],
  include: ["src/**/*.{test,spec}.{ts,tsx}"],
  css: true,
};

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(cwd, "./src"),
      },
    ],
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          ...baseTestConfig,
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config.
          // https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(cwd, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          include: [],
          setupFiles: [
            ...baseTestConfig.setupFiles,
            ".storybook/vitest.setup.ts",
          ],
        },
      },
    ],
  },
});

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const isCI = process.env.CI === 'true';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
      '@react-email/render': path.resolve(dirname, 'node_modules/@react-email/render/dist/node/index.mjs'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.*', 'src/stories/**', 'src/app/**', '**/*.d.ts'],
    },
    reporters: isCI
      ? [
          'default',
          [
            'junit',
            {
              outputFile: 'reports/vitest-junit.xml',
            },
          ],
        ]
      : ['default'],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});

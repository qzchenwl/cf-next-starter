import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
  const { default: react } = await import('@vitejs/plugin-react');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      globals: true,
      css: true,
      coverage: {
        reportsDirectory: './coverage',
        reporter: ['text', 'lcov'],
      },
      env: {
        NEXT_PUBLIC_VERCEL_ENV: 'test',
      },
    },
  };
});


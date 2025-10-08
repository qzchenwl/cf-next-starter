import { defineConfig } from 'next-intl/config';

export default defineConfig({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'never',
});

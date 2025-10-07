export const i18n = {
  locales: ['en', 'zh'],
  defaultLocale: 'en',
} as const;

export type Locale = (typeof i18n)['locales'][number];

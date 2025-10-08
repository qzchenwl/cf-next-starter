export const locales = ['en', 'zh'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeCookieName = 'locale';

export function isSupportedLocale(locale: string | undefined | null): locale is Locale {
  return locales.includes(locale as Locale);
}

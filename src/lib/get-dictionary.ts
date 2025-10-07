import 'server-only';

import type { Dictionary } from '@/lib/i18n-types';
import { i18n, type Locale } from '@/lib/i18n-config';

const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  zh: () => import('@/locales/zh.json').then((module) => module.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionaryLoader = dictionaries[locale];

  if (!dictionaryLoader) {
    return dictionaries[i18n.defaultLocale]();
  }

  return dictionaryLoader();
}

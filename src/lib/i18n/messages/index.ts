import type { Locale } from '@/lib/i18n/config';
import en from './en';
import zh from './zh';

export const messages = {
  en,
  zh,
} as const satisfies Record<Locale, typeof en>;

export type Messages = (typeof messages)[Locale];

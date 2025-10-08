import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { messages, type Messages } from '@/lib/i18n/messages';

export async function getDictionary(locale: Locale): Promise<Messages> {
  return messages[locale] ?? messages[defaultLocale];
}

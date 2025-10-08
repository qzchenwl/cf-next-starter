import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { messages } from '@/lib/i18n/messages';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale: Locale = locale && isLocale(locale) ? locale : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: messages[resolvedLocale],
  };
});

import { cookies, headers } from 'next/headers';

import { defaultLocale, isSupportedLocale, localeCookieName, type Locale } from './config';

function parseAcceptLanguage(value: string | null): Locale | null {
  if (!value) {
    return null;
  }

  const tokens = value
    .split(',')
    .map((part) => part.trim().split(';')[0])
    .filter(Boolean);

  for (const token of tokens) {
    if (isSupportedLocale(token)) {
      return token;
    }

    const [base] = token.split('-');
    if (isSupportedLocale(base)) {
      return base;
    }
  }

  return null;
}

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  if (isSupportedLocale(localeCookie)) {
    return localeCookie;
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get('accept-language');
  const negotiated = parseAcceptLanguage(acceptLanguage);
  if (negotiated) {
    return negotiated;
  }

  return defaultLocale;
}

export async function getRequestMessages(locale: Locale) {
  const messages = await import(`../../messages/${locale}.json`);
  return messages.default;
}

import type { Metadata } from 'next';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { HomePage } from '@/components/home-page';
import { defaultLocale } from '@/lib/i18n/config';

export async function generateMetadata(): Promise<Metadata> {
  const translate = await getTranslations({ locale: defaultLocale, namespace: 'metadata' });

  return {
    title: translate('title'),
    description: translate('description'),
  };
}

export default async function RootHome() {
  setRequestLocale(defaultLocale);
  const messages = await getMessages({ locale: defaultLocale });

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      <HomePage locale={defaultLocale} />
    </NextIntlClientProvider>
  );
}

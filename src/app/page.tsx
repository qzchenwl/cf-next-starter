import type { Metadata } from 'next';

import { HomePage } from '@/components/home-page';
import { LocaleAttributeUpdater } from '@/components/locale-attribute-updater';
import { TranslationsProvider } from '@/components/translations-provider';
import { createTranslator } from '@/lib/i18n/create-translator';
import { defaultLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary(defaultLocale);
  const translate = createTranslator(dictionary);

  return {
    title: translate('metadata.title'),
    description: translate('metadata.description'),
  };
}

export default async function RootHome() {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <TranslationsProvider locale={defaultLocale} messages={dictionary}>
      <LocaleAttributeUpdater locale={defaultLocale} />
      <HomePage locale={defaultLocale} messages={dictionary} />
    </TranslationsProvider>
  );
}

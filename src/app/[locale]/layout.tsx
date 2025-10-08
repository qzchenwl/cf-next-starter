import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LocaleAttributeUpdater } from '@/components/locale-attribute-updater';
import { TranslationsProvider } from '@/components/translations-provider';
import { createTranslator } from '@/lib/i18n/create-translator';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { isLocale, locales } from '@/lib/i18n/config';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const translate = createTranslator(dictionary);

  return {
    title: translate('metadata.title'),
    description: translate('metadata.description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <TranslationsProvider locale={locale} messages={dictionary}>
      <LocaleAttributeUpdater locale={locale} />
      {children}
    </TranslationsProvider>
  );
}

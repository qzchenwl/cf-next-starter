import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '../globals.css';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { TranslationProvider } from '@/lib/translation-provider';
import { getDictionary } from '@/lib/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n-config';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;

  const dictionary = await getDictionary(resolvedLocale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const resolvedLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;

  const dictionary = await getDictionary(resolvedLocale);

  return (
    <html lang={resolvedLocale}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans text-foreground antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <TranslationProvider locale={resolvedLocale} dictionary={dictionary}>
          <div className="flex min-h-screen flex-col">
            <div className="flex justify-end px-6 py-4 sm:px-10 lg:px-12">
              <LocaleSwitcher />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </TranslationProvider>
      </body>
    </html>
  );
}

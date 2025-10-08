import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';

import './globals.css';
import { cn } from '@/lib/utils';
import { getRequestLocale, getRequestMessages } from '@/lib/i18n/server';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cloudflare + Next.js starter',
  description: 'Check your Cloudflare bindings with a shadcn/ui dashboard.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const messages = await getRequestMessages(locale);

  return (
    <html lang={locale}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans text-foreground antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

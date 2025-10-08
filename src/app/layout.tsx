import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { defaultLocale } from '@/lib/i18n/config';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans text-foreground antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}

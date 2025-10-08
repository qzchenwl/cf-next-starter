'use client';

import { useRouter, usePathname } from 'next/navigation';

import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';
import { useLocale, useTranslations } from '@/components/translations-provider';

function replaceLocaleInPath(pathname: string, locale: Locale) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalizedPath.slice(1).split('/').filter(Boolean);
  const rest = segments.slice(1);
  const tail = rest.join('/');

  if (locale === defaultLocale) {
    return tail ? `/${tail}` : '/';
  }

  return tail ? `/${locale}/${tail}` : `/${locale}`;
}

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('localeSwitcher');

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{t('label')}</span>
      <select
        className="rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;
          const nextPath = replaceLocaleInPath(pathname ?? '/', nextLocale);
          router.push(nextPath);
        }}
      >
        {locales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {t(`options.${supportedLocale}`)}
          </option>
        ))}
      </select>
    </label>
  );
}

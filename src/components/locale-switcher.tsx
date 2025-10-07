'use client';

import type { ChangeEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { i18n } from '@/lib/i18n-config';
import { useLocale, useTranslations } from '@/lib/translation-provider';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation.localeSwitcher');

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;

    if (nextLocale === locale) {
      return;
    }

    const segments = pathname.split('/');
    segments[1] = nextLocale;

    const nextPath = segments.join('/') || '/';
    router.push(nextPath);
  };

  return (
    <label className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="hidden sm:inline">{t('label')}</span>
      <select
        aria-label={t('label')}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        onChange={handleChange}
        value={locale}
      >
        {i18n.locales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {t(`locales.${supportedLocale}`)}
          </option>
        ))}
      </select>
    </label>
  );
}

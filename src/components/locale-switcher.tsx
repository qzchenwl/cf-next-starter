'use client';

import { useTransition } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { setLocale } from '@/lib/i18n/actions';
import { locales } from '@/lib/i18n/config';

function getNextLocale(current: string) {
  const index = locales.indexOf(current as (typeof locales)[number]);
  if (index === -1) {
    return locales[0];
  }

  const nextIndex = (index + 1) % locales.length;
  return locales[nextIndex];
}

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('LocaleSwitcher');
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        const nextLocale = getNextLocale(locale);
        startTransition(async () => {
          await setLocale(nextLocale);
        });
      }}
      disabled={isPending}
    >
      {isPending ? t('pending') : locale === 'zh' ? t('switchToEn') : t('switchToZh')}
    </Button>
  );
}

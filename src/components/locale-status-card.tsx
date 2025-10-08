'use client';

import { useTransition } from 'react';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { setLocale } from '@/lib/i18n/actions';
import { locales } from '@/lib/i18n/config';

function normalizeLocale(locale: string) {
  const fallback = locales[0];
  return (locales.includes(locale as (typeof locales)[number]) ? locale : fallback) as (typeof locales)[number];
}

function getNextLocale(current: string) {
  const normalized = normalizeLocale(current);
  const index = locales.indexOf(normalized);
  const nextIndex = (index + 1) % locales.length;

  return locales[nextIndex];
}

export function LocaleStatusCard() {
  const locale = normalizeLocale(useLocale());
  const t = useTranslations('LocaleCard');
  const [isPending, startTransition] = useTransition();

  const nextLocale = getNextLocale(locale);
  const currentLabel = t(`languages.${locale}`);
  const nextLabel = t(`languages.${nextLocale}`);

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <Languages className="h-5 w-5" />
            </span>
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <Badge variant="outline">{currentLabel}</Badge>
        </div>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="rounded-lg border border-dashed border-border bg-muted/60 p-4 text-sm leading-relaxed">
          {t('activeLanguage', { language: currentLabel })}
        </div>
      </CardContent>
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button
          onClick={() => {
            startTransition(async () => {
              await setLocale(nextLocale);
            });
          }}
          disabled={isPending}
        >
          {isPending ? t('pending') : t('cta', { language: nextLabel })}
        </Button>
      </CardFooter>
    </Card>
  );
}

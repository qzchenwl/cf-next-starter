'use client';

import { useState } from 'react';
import { Bug } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

type CardState = 'idle' | 'triggering' | 'reported' | 'failed';

type DebugSentryResponse = {
  ok: boolean;
  error?: string;
};

export function SentryStatusCard() {
  const [state, setState] = useState<CardState>('idle');
  const [details, setDetails] = useState<string | null>(null);
  const t = useTranslations('components.sentryStatusCard');

  const handleTriggerTestEvent = async () => {
    setState('triggering');
    setDetails(null);

    try {
      const response = await fetch('/api/debug-sentry', {
        method: 'POST',
        cache: 'no-store',
      });

      if (!response.ok) {
        let message = t('statuses.reported.message');

        try {
          const payload = (await response.json()) as DebugSentryResponse;
          if (!payload.ok && payload.error) {
            message = payload.error;
          }
        } catch {
          // Ignore JSON parsing errors and keep the default message.
        }

        setDetails(message);
        setState('reported');
        return;
      }

      const payload = (await response.json()) as DebugSentryResponse;
      const message = payload.ok && payload.error ? payload.error : t('successWithoutError');

      setDetails(message);
      setState('reported');
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errors.requestFailed');

      setDetails(message);
      setState('failed');
    }
  };

  let badgeLabel: string = t('statuses.idle.label');
  let badgeVariant: BadgeProps['variant'] = 'outline';
  let statusMessage = t('statuses.idle.message');

  if (state === 'triggering') {
    badgeLabel = t('statuses.triggering.label');
    badgeVariant = 'secondary';
    statusMessage = t('statuses.triggering.message');
  } else if (state === 'reported') {
    badgeLabel = t('statuses.reported.label');
    badgeVariant = 'default';
    statusMessage = details ?? t('statuses.reported.message');
  } else if (state === 'failed') {
    badgeLabel = t('statuses.failed.label');
    badgeVariant = 'destructive';
    statusMessage = details ?? t('statuses.failed.message');
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <Bug className="h-5 w-5" />
            </span>
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          {t('paragraphs.intro.part1')}
          <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">/api/debug-sentry</code>
          {t('paragraphs.intro.part2')}
          <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">@sentry/cloudflare</code>
          {t('paragraphs.intro.part3')}
        </p>
        <p>
          {t('paragraphs.followup.part1')}
          <span className="font-medium text-foreground">{t('paragraphs.followup.span')}</span>
          {t('paragraphs.followup.part2')}
        </p>
      </CardContent>
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button onClick={handleTriggerTestEvent} disabled={state === 'triggering'}>
          {state === 'triggering' ? t('button.loading') : t('button.idle')}
        </Button>
      </CardFooter>
    </Card>
  );
}

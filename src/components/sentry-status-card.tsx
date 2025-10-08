'use client';

import { useState } from 'react';
import { Bug } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type CardState = 'idle' | 'triggering' | 'reported' | 'failed';

type DebugSentryResponse = {
  ok: boolean;
  error?: string;
};

export function SentryStatusCard() {
  const [state, setState] = useState<CardState>('idle');
  const [details, setDetails] = useState<string | null>(null);

  const handleTriggerTestEvent = async () => {
    setState('triggering');
    setDetails(null);

    try {
      const response = await fetch('/api/debug-sentry', {
        method: 'POST',
        cache: 'no-store',
      });

      if (!response.ok) {
        let message = 'Triggered a test error. Check your Sentry project for the captured event.';

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
      const message =
        payload.ok && payload.error
          ? payload.error
          : 'Request succeeded but no error was triggered. Verify your worker configuration.';

      setDetails(message);
      setState('reported');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to reach the Sentry test endpoint. Please try again.';

      setDetails(message);
      setState('failed');
    }
  };

  let badgeLabel: string = 'Idle';
  let badgeVariant: BadgeProps['variant'] = 'outline';
  let statusMessage = 'Trigger a synthetic error to confirm Sentry is receiving events from this worker.';

  if (state === 'triggering') {
    badgeLabel = 'Triggering';
    badgeVariant = 'secondary';
    statusMessage = 'Sending a test error to Sentry...';
  } else if (state === 'reported') {
    badgeLabel = 'Reported';
    badgeVariant = 'default';
    statusMessage = details ?? 'Test error dispatched. Check Sentry for the captured event.';
  } else if (state === 'failed') {
    badgeLabel = 'Failed';
    badgeVariant = 'destructive';
    statusMessage = details ?? 'Unable to trigger the Sentry test event.';
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <Bug className="h-5 w-5" />
            </span>
            <CardTitle>Sentry</CardTitle>
          </div>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          The button below calls{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">/api/debug-sentry</code>, which
          intentionally throws and reports an error using the <code>@sentry/cloudflare</code> SDK.
        </p>
        <p>
          After triggering the event, open your Sentry dashboard to verify that the issue appears along with a span
          named
          <span className="font-medium text-foreground">&nbsp;status-card.debug-sentry</span>.
        </p>
      </CardContent>
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button onClick={handleTriggerTestEvent} disabled={state === 'triggering'}>
          {state === 'triggering' ? 'Triggering...' : 'Send test event'}
        </Button>
      </CardFooter>
    </Card>
  );
}

'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const sentryIssuesUrl = 'https://cwl.sentry.io/issues/?project=4510147471802368';
const sentryDocsUrl = 'https://docs.sentry.io/platforms/javascript/guides/nextjs/';

class SentryExampleFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'SentryExampleFrontendError';
  }
}

type StatusState = 'idle' | 'checking' | 'connected' | 'error';

export function SentryStatusCard() {
  const [status, setStatus] = useState<StatusState>('idle');
  const [statusMessage, setStatusMessage] = useState('Diagnose Sentry to make sure events can be delivered.');
  const [isSending, setIsSending] = useState(false);
  const [eventSent, setEventSent] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [backendCaptured, setBackendCaptured] = useState(false);
  const [frontendEventId, setFrontendEventId] = useState<string | null>(null);

  const diagnoseConnectivity = useCallback(async () => {
    setStatus('checking');
    setStatusMessage('Checking browser connectivity to Sentry...');
    setEventError(null);
    setEventSent(false);
    setBackendCaptured(false);
    setFrontendEventId(null);

    try {
      const result = await Sentry.diagnoseSdkConnectivity();

      if (result === 'sentry-unreachable') {
        setStatus('error');
        setStatusMessage(
          'It looks like requests to Sentry are being blocked. Disable ad blockers or firewalls, then try again.',
        );
        return;
      }

      setStatus('connected');
      setStatusMessage('Connected! Send a sample event to verify your instrumentation.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to reach Sentry. Check your network settings and try again.';
      setStatus('error');
      setStatusMessage(message);
    }
  }, []);

  useEffect(() => {
    void diagnoseConnectivity();
  }, [diagnoseConnectivity]);

  const handleSendSampleError = async () => {
    if (status !== 'connected') {
      return;
    }

    setIsSending(true);
    setEventError(null);
    setEventSent(false);
    setBackendCaptured(false);
    setFrontendEventId(null);

    try {
      let didTriggerBackendError = false;

      await Sentry.startSpan(
        {
          name: 'Example Frontend/Backend Span',
          op: 'test',
        },
        async () => {
          const response = await fetch('/api/sentry-example-api', {
            cache: 'no-store',
          });

          if (!response.ok) {
            didTriggerBackendError = true;
            return;
          }

          throw new Error('Expected a 500 response from the sample API route, but it succeeded.');
        },
      );

      const frontendError = new SentryExampleFrontendError(
        'This error is raised on the frontend of the Sentry sample card.',
      );
      const eventId = Sentry.captureException(frontendError);

      if ('flush' in Sentry && typeof Sentry.flush === 'function') {
        await Sentry.flush(2000);
      }

      setBackendCaptured(didTriggerBackendError);
      setFrontendEventId(eventId ?? null);
      setEventSent(true);
      setStatusMessage(
        didTriggerBackendError
          ? 'Sample backend exception triggered. A frontend error has also been dispatched to Sentry.'
          : 'Frontend sample error sent. The API did not return 500, so confirm your server instrumentation.',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to send the sample error. Confirm your Sentry DSN and try again.';
      setEventError(message);
      setStatus('error');
      setStatusMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  let statusLabel: string = 'Idle';
  let badgeVariant: BadgeProps['variant'] = 'outline';

  if (status === 'checking') {
    statusLabel = 'Checking';
    badgeVariant = 'secondary';
  } else if (status === 'connected') {
    statusLabel = 'Connected';
    badgeVariant = 'default';
  } else if (status === 'error') {
    statusLabel = 'Error';
    badgeVariant = 'destructive';
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <SentryMark className="h-5 w-5" />
            </span>
            <CardTitle>Sentry Monitoring</CardTitle>
          </div>
          <Badge variant={badgeVariant}>{statusLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          This check triggers both frontend and backend errors so you can validate stack traces, spans, and alerts in
          Sentry.
        </p>
        {eventSent ? (
          <div className="rounded-lg border border-emerald-400/40 bg-emerald-100/70 p-3 text-sm text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-100">
            <p>
              Sample events were sent. View them on the{' '}
              <Link className="font-medium underline" href={sentryIssuesUrl} target="_blank" rel="noopener noreferrer">
                Sentry Issues page
              </Link>
              .
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>
                Backend sample API response: {backendCaptured ? '500 captured in Sentry' : 'unexpectedly succeeded'}.
              </li>
              <li>Frontend sample event ID: {frontendEventId ?? 'pending propagation'}.</li>
            </ul>
          </div>
        ) : null}
        {eventError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {eventError}
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Need help? Review the{' '}
          <Link className="font-medium underline" href={sentryDocsUrl} target="_blank" rel="noopener noreferrer">
            Sentry Next.js guide
          </Link>
          .
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={diagnoseConnectivity} disabled={status === 'checking'}>
          {status === 'checking' ? 'Diagnosing...' : 'Re-run diagnostic'}
        </Button>
        <Button onClick={handleSendSampleError} disabled={status !== 'connected' || isSending}>
          {isSending ? 'Sending...' : 'Send sample error'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function SentryMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.85 2.995a3.698 3.698 0 0 1 1.353 1.354l16.303 28.278a3.703 3.703 0 0 1-1.354 5.053 3.694 3.694 0 0 1-1.848.496h-3.828a31.149 31.149 0 0 0 0-3.09h3.815a.61.61 0 0 0 .537-.917L20.523 5.893a.61.61 0 0 0-1.057 0l-3.739 6.494a28.948 28.948 0 0 1 9.63 10.453 28.988 28.988 0 0 1 3.499 13.78v1.542h-9.852v-1.544a19.106 19.106 0 0 0-2.182-8.85 19.08 19.08 0 0 0-6.032-6.829l-1.85 3.208a15.377 15.377 0 0 1 6.382 12.484v1.542H3.696A3.694 3.694 0 0 1 0 34.473c0-.648.17-1.286.494-1.849l2.33-4.074a8.562 8.562 0 0 1 2.689 1.536L3.158 34.17a.611.611 0 0 0 .538.917h8.448a12.481 12.481 0 0 0-6.037-9.09l-1.344-.772 4.908-8.545 1.344.77a22.16 22.16 0 0 1 7.705 7.444 22.193 22.193 0 0 1 3.316 10.193h3.699a25.892 25.892 0 0 0-3.811-12.033 25.856 25.856 0 0 0-9.046-8.796l-1.344-.772 5.269-9.136a3.698 3.698 0 0 1 3.2-1.849c.648 0 1.285.17 1.847.495Z"
        fill="currentColor"
      />
    </svg>
  );
}

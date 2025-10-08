'use client';

import { useState } from 'react';
import { Bug } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type SentryResponse =
  | {
      ok: true;
      message: string;
      eventId: string | null;
    }
  | {
      ok: false;
      error: string;
    };

export function SentryStatusCard() {
  const [eventId, setEventId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendTestEvent = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    setEventId(null);

    try {
      const response = await fetch('/api/sentry', {
        method: 'POST',
        cache: 'no-store',
      });
      const payload = (await response.json()) as SentryResponse;

      if (!response.ok || !payload.ok) {
        const messageText = 'error' in payload ? payload.error : `Request failed with status ${response.status}`;
        throw new Error(messageText);
      }

      setEventId(payload.eventId);
      setMessage(payload.message);
    } catch (fetchError) {
      const messageText =
        fetchError instanceof Error ? fetchError.message : 'Failed to send the Sentry test event. Please try again.';
      setError(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  let statusMessage = 'Send a test event to confirm Sentry is receiving data.';
  let statusLabel: string = 'Idle';
  let statusVariant: BadgeProps['variant'] = 'outline';

  if (isLoading) {
    statusLabel = 'Sending';
    statusVariant = 'secondary';
    statusMessage = 'Sending diagnostic event to Sentry...';
  } else if (error) {
    statusLabel = 'Error';
    statusVariant = 'destructive';
    statusMessage = error;
  } else if (eventId) {
    statusLabel = 'Connected';
    statusVariant = 'default';
    statusMessage = message ?? 'Test event sent! Check your Sentry project for the payload.';
  } else if (message) {
    statusMessage = message;
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
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      {eventId ? (
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Event ID</p>
            <code className="block break-all rounded-lg border border-dashed border-border bg-muted/60 p-3">
              {eventId}
            </code>
          </div>
        </CardContent>
      ) : null}
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button onClick={handleSendTestEvent} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send test event'}
        </Button>
      </CardFooter>
    </Card>
  );
}

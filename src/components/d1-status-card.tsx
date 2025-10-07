'use client';

import { useState } from 'react';
import { Database } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type TimestampResponse = {
  ok: boolean;
  currentTimestamp: string | null;
  error?: string;
};

export function D1StatusCard() {
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckConnection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/d1', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as TimestampResponse;

      if (!response.ok || !payload.ok || !payload.currentTimestamp) {
        const message = payload.error ?? `Request failed with status ${response.status}`;
        setTimestamp(null);
        setError(message);
        return;
      }

      setTimestamp(payload.currentTimestamp);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to read from D1. Please try again.';
      setTimestamp(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  let statusMessage = 'Click the button to verify your D1 connection.';
  let statusLabel: string = 'Idle';
  let statusVariant: BadgeProps['variant'] = 'outline';

  if (isLoading) {
    statusLabel = 'Checking';
    statusVariant = 'secondary';
    statusMessage = 'Checking database connection...';
  } else if (timestamp) {
    statusLabel = 'Connected';
    statusVariant = 'default';
    statusMessage = 'Connected! The database responded with the timestamp below.';
  } else if (error) {
    statusLabel = 'Error';
    statusVariant = 'destructive';
    statusMessage = error;
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <Database className="h-5 w-5" />
            </span>
            <CardTitle>Cloudflare D1</CardTitle>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {timestamp ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/60 p-4 font-mono text-sm">
            {timestamp} (UTC)
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button onClick={handleCheckConnection} disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Check now'}
        </Button>
      </CardFooter>
    </Card>
  );
}

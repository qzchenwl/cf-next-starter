'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/components/translations-provider';

type KvKey = {
  name: string;
  expiration: number | null;
};

type KvResponse =
  | {
      ok: true;
      keys: KvKey[];
      listComplete: boolean;
    }
  | {
      ok: false;
      error: string;
    };

function formatExpiration(expiration: number | null) {
  if (!expiration) {
    return null;
  }

  const expiryDate = new Date(expiration * 1000);
  if (Number.isNaN(expiryDate.getTime())) {
    return null;
  }

  return expiryDate.toUTCString();
}

export function KvStatusCard() {
  const [keys, setKeys] = useState<KvKey[] | null>(null);
  const [isListComplete, setIsListComplete] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('components.kvStatusCard');

  const handleCheckKv = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/kv', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as KvResponse;

      if (!response.ok || !payload.ok) {
        const message = 'error' in payload ? payload.error : `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      setKeys(payload.keys);
      setIsListComplete(payload.listComplete);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : t('errors.fetchFailed');
      setKeys(null);
      setIsListComplete(true);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  let statusMessage = t('statuses.idle.message');
  let statusLabel: string = t('statuses.idle.label');
  let statusVariant: BadgeProps['variant'] = 'outline';

  if (isLoading) {
    statusLabel = t('statuses.checking.label');
    statusVariant = 'secondary';
    statusMessage = t('statuses.checking.message');
  } else if (keys) {
    statusLabel = t('statuses.connectedEmpty.label');
    statusVariant = 'default';

    if (keys.length === 0) {
      statusMessage = t('statuses.connectedEmpty.message');
    } else {
      const countLabel = keys.length === 1 ? t('countLabel.one') : t('countLabel.other');
      statusMessage = t('statuses.connectedWithItems.message', { count: keys.length, itemLabel: countLabel });
      statusLabel = t('statuses.connectedWithItems.label');
    }
  } else if (error) {
    statusLabel = t('statuses.error.label');
    statusVariant = 'destructive';
    statusMessage = error;
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <KeyRound className="h-5 w-5" />
            </span>
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      {keys && keys.length > 0 ? (
        <CardContent className="space-y-3">
          <ul className="grid gap-3 text-sm">
            {keys.map((key) => {
              const formattedExpiration = formatExpiration(key.expiration);

              return (
                <li key={key.name} className="rounded-lg border border-border/80 bg-muted/50 p-3">
                  <p className="font-medium text-foreground break-all">{key.name}</p>
                  {formattedExpiration ? (
                    <p className="text-xs text-muted-foreground">
                      {t('expirationLabel', { date: formattedExpiration })}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {!isListComplete ? (
            <p className="text-xs text-muted-foreground">{t('listNotComplete', { count: keys.length })}</p>
          ) : null}
        </CardContent>
      ) : null}
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button onClick={handleCheckKv} disabled={isLoading}>
          {isLoading ? t('button.loading') : t('button.idle')}
        </Button>
      </CardFooter>
    </Card>
  );
}

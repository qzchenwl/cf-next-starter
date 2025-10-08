'use client';

import { useState } from 'react';
import { Boxes } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

type R2Object = {
  key: string;
  size: number;
  uploaded: string | null;
};

type R2Response =
  | {
      ok: true;
      objects: R2Object[];
      truncated: boolean;
    }
  | {
      ok: false;
      error: string;
    };

export function R2StatusCard() {
  const [objects, setObjects] = useState<R2Object[] | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('components.r2StatusCard');

  const handleCheckBucket = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/r2', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as R2Response;

      if (!response.ok || !payload.ok) {
        const message = 'error' in payload ? payload.error : `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      setObjects(payload.objects);
      setIsTruncated(payload.truncated);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : t('errors.fetchFailed');
      setObjects(null);
      setIsTruncated(false);
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
  } else if (objects) {
    statusLabel = t('statuses.connectedEmpty.label');
    statusVariant = 'default';

    if (objects.length === 0) {
      statusMessage = t('statuses.connectedEmpty.message');
    } else {
      const countLabel = objects.length === 1 ? t('countLabel.one') : t('countLabel.other');
      statusMessage = t('statuses.connectedWithItems.message', { count: objects.length, itemLabel: countLabel });
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
              <Boxes className="h-5 w-5" />
            </span>
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      {objects && objects.length > 0 ? (
        <CardContent className="space-y-3">
          <ul className="grid gap-3 text-sm">
            {objects.map((object) => (
              <li key={object.key} className="rounded-lg border border-border/80 bg-muted/50 p-3">
                <p className="font-medium text-foreground">{object.key}</p>
                <p className="text-xs text-muted-foreground">
                  {t('objectSize', { size: object.size })}
                  {object.uploaded
                    ? ` • ${t('objectUploadedAt', { date: new Date(object.uploaded).toUTCString() })}`
                    : null}
                </p>
              </li>
            ))}
          </ul>
          {isTruncated ? (
            <p className="text-xs text-muted-foreground">{t('truncatedNotice', { count: objects.length })}</p>
          ) : null}
        </CardContent>
      ) : null}
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button onClick={handleCheckBucket} disabled={isLoading}>
          {isLoading ? t('button.loading') : t('button.idle')}
        </Button>
      </CardFooter>
    </Card>
  );
}

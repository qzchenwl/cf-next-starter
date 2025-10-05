"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const handleCheckBucket = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/r2", {
        cache: "no-store",
      });
      const payload = (await response.json()) as R2Response;

      if (!response.ok || !payload.ok) {
        const message = "error" in payload ? payload.error : `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      setObjects(payload.objects);
      setIsTruncated(payload.truncated);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to read from R2. Please try again.";
      setObjects(null);
      setIsTruncated(false);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const status = useMemo(() => {
    if (isLoading) {
      return {
        message: "Querying R2 bucket...",
        badge: "Checking",
        variant: "muted" as const,
      };
    }

    if (objects) {
      if (objects.length === 0) {
        return {
          message: "Connected! The bucket is currently empty.",
          badge: "Connected",
          variant: "default" as const,
        };
      }

      const countLabel = objects.length === 1 ? "object" : "objects";
      return {
        message: `Connected! Showing ${objects.length} ${countLabel} from the bucket.`,
        badge: "Connected",
        variant: "default" as const,
      };
    }

    if (error) {
      return {
        message: error,
        badge: "Error",
        variant: "destructive" as const,
      };
    }

    return {
      message: "Click the button to list a few objects from your R2 bucket.",
      badge: "Idle",
      variant: "muted" as const,
    };
  }, [error, isLoading, objects]);

  return (
    <Card className="w-full">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>Cloudflare R2</CardTitle>
            <CardDescription>Durable object storage with S3 compatibility.</CardDescription>
          </div>
          <Badge variant={status.variant}>{status.badge}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{status.message}</p>
        {objects && objects.length > 0 ? (
          <div className="space-y-2">
            <ul className="space-y-2">
              {objects.map((object) => (
                <li
                  key={object.key}
                  className="rounded-lg border bg-muted/40 px-4 py-3 text-sm"
                >
                  <p className="font-medium text-foreground break-all">{object.key}</p>
                  <p className="text-xs text-muted-foreground">
                    {object.size.toLocaleString()} bytes
                    {object.uploaded
                      ? ` • uploaded ${new Date(object.uploaded).toUTCString()}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
            {isTruncated ? (
              <Badge variant="outline" className="w-fit">Truncated list</Badge>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <Button onClick={handleCheckBucket} disabled={isLoading}>
          {isLoading ? "Checking..." : "List objects"}
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a
            href="https://developers.cloudflare.com/r2/"
            target="_blank"
            rel="noreferrer"
          >
            View docs
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

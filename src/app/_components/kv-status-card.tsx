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

  const handleCheckKv = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/kv", {
        cache: "no-store",
      });
      const payload = (await response.json()) as KvResponse;

      if (!response.ok || !payload.ok) {
        const message = "error" in payload ? payload.error : `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      setKeys(payload.keys);
      setIsListComplete(payload.listComplete);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to query KV. Please try again.";
      setKeys(null);
      setIsListComplete(true);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const status = useMemo(() => {
    if (isLoading) {
      return {
        message: "Querying KV namespace...",
        badge: "Checking",
        variant: "muted" as const,
      };
    }

    if (keys) {
      if (keys.length === 0) {
        return {
          message: "Connected! The namespace is currently empty.",
          badge: "Connected",
          variant: "default" as const,
        };
      }

      const countLabel = keys.length === 1 ? "key" : "keys";
      return {
        message: `Connected! Showing ${keys.length} ${countLabel} from the namespace.`,
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
      message: "Click the button to list a few keys from your KV namespace.",
      badge: "Idle",
      variant: "muted" as const,
    };
  }, [error, isLoading, keys]);

  return (
    <Card className="w-full">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>Cloudflare KV</CardTitle>
            <CardDescription>Ultra-fast key-value storage at the edge.</CardDescription>
          </div>
          <Badge variant={status.variant}>{status.badge}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{status.message}</p>
        {keys && keys.length > 0 ? (
          <div className="space-y-2">
            <ul className="space-y-2">
              {keys.map((key) => (
                <li
                  key={key.name}
                  className="rounded-lg border bg-muted/40 px-4 py-3 text-sm"
                >
                  <p className="font-medium text-foreground break-all">{key.name}</p>
                  {key.expiration ? (
                    <p className="text-xs text-muted-foreground">
                      Expires {formatExpiration(key.expiration)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            {!isListComplete ? (
              <Badge variant="outline" className="w-fit">
                Partial results
              </Badge>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <Button onClick={handleCheckKv} disabled={isLoading}>
          {isLoading ? "Checking..." : "List keys"}
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a
            href="https://developers.cloudflare.com/kv/"
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

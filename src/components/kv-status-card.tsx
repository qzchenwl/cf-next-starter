"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
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
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to query KV. Please try again.";
      setKeys(null);
      setIsListComplete(true);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  let statusMessage = "Click the button to list a few keys from your KV namespace.";
  let statusLabel: string = "Idle";
  let statusVariant: BadgeProps["variant"] = "outline";

  if (isLoading) {
    statusLabel = "Checking";
    statusVariant = "secondary";
    statusMessage = "Querying KV namespace...";
  } else if (keys) {
    statusLabel = "Connected";
    statusVariant = "default";

    if (keys.length === 0) {
      statusMessage = "Connected! The namespace is currently empty.";
    } else {
      const countLabel = keys.length === 1 ? "key" : "keys";
      statusMessage = `Connected! Showing ${keys.length} ${countLabel} from the namespace.`;
    }
  } else if (error) {
    statusLabel = "Error";
    statusVariant = "destructive";
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
            <CardTitle>Cloudflare KV</CardTitle>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      {keys && keys.length > 0 ? (
        <CardContent className="space-y-3">
          <ul className="grid gap-3 text-sm">
            {keys.map((key) => (
              <li
                key={key.name}
                className="rounded-lg border border-border/80 bg-muted/50 p-3"
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
            <p className="text-xs text-muted-foreground">
              Showing the first {keys.length} items. Add a prefix or pagination
              to fetch more.
            </p>
          ) : null}
        </CardContent>
      ) : null}
      <CardFooter className="justify-end border-t border-border pt-6">
        <Button onClick={handleCheckKv} disabled={isLoading}>
          {isLoading ? "Checking..." : "List keys"}
        </Button>
      </CardFooter>
    </Card>
  );
}

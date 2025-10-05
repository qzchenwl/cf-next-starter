"use client";

import { useState } from "react";

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
      const response = await fetch("/api/d1", {
        cache: "no-store",
      });
      const payload = (await response.json()) as TimestampResponse;

      if (!response.ok || !payload.ok || !payload.currentTimestamp) {
        const message = payload.error ?? `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      setTimestamp(payload.currentTimestamp);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to read from D1. Please try again.";
      setTimestamp(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  let statusMessage = "Click the button to verify your D1 connection.";
  let badgeLabel = "Idle";
  let badgeVariant: "default" | "muted" | "destructive" = "muted";

  if (isLoading) {
    statusMessage = "Checking database connection...";
    badgeLabel = "Checking";
    badgeVariant = "muted";
  } else if (timestamp) {
    statusMessage = `Connected! The database responded with ${timestamp} (UTC).`;
    badgeLabel = "Connected";
    badgeVariant = "default";
  } else if (error) {
    statusMessage = error;
    badgeLabel = "Error";
    badgeVariant = "destructive";
  }

  return (
    <Card className="w-full">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>Cloudflare D1</CardTitle>
            <CardDescription>Relational storage, powered by SQLite.</CardDescription>
          </div>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{statusMessage}</p>
        {timestamp ? (
          <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Last response (UTC)
            </p>
            <p className="mt-1 font-medium text-foreground">{timestamp}</p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <Button onClick={handleCheckConnection} disabled={isLoading}>
          {isLoading ? "Checking..." : "Check now"}
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
        >
          <a
            href="https://developers.cloudflare.com/d1/"
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

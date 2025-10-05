"use client";

import { useState } from "react";

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

  if (isLoading) {
    statusMessage = "Checking database connection...";
  } else if (timestamp) {
    statusMessage = `Connected! The database responded with ${timestamp} (UTC).`;
  } else if (error) {
    statusMessage = error;
  }

  return (
    <section className="w-full max-w-xl rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white/60 dark:bg-black/40 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Cloudflare D1 connection check</h2>
          <p className="mt-1 text-sm text-black/80 dark:text-white/80">{statusMessage}</p>
        </div>
        <button
          type="button"
          onClick={handleCheckConnection}
          disabled={isLoading}
          className="h-10 shrink-0 rounded-full border border-solid border-black/[.08] bg-white/70 px-4 text-sm font-medium transition-colors hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/[.145] dark:bg-black/40 dark:hover:bg-black/60"
        >
          {isLoading ? "Checking..." : "Check now"}
        </button>
      </div>
    </section>
  );
}

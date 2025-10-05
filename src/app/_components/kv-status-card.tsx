"use client";

import { useState } from "react";

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

  let statusMessage = "Click the button to list a few keys from your KV namespace.";

  if (isLoading) {
    statusMessage = "Querying KV namespace...";
  } else if (keys) {
    if (keys.length === 0) {
      statusMessage = "Connected! The namespace is currently empty.";
    } else {
      const countLabel = keys.length === 1 ? "key" : "keys";
      statusMessage = `Connected! Showing ${keys.length} ${countLabel} from the namespace.`;
    }
  } else if (error) {
    statusMessage = error;
  }

  return (
    <section className="w-full max-w-xl rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white/60 dark:bg-black/40 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full">
          <h2 className="text-base font-semibold">Cloudflare KV connection check</h2>
          <p className="mt-1 text-sm text-black/80 dark:text-white/80">{statusMessage}</p>

          {keys && keys.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-black/80 dark:text-white/80">
              {keys.map((key) => (
                <li key={key.name} className="rounded-md bg-black/[.04] p-2 dark:bg-white/[.06]">
                  <p className="font-medium break-all">{key.name}</p>
                  {key.expiration ? (
                    <p className="text-xs text-black/70 dark:text-white/70">
                      Expires {formatExpiration(key.expiration)}
                    </p>
                  ) : null}
                </li>
              ))}
              {!isListComplete ? (
                <li className="text-xs text-black/70 dark:text-white/70">
                  Showing the first {keys.length} items. Add a prefix or pagination to fetch more.
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCheckKv}
          disabled={isLoading}
          className="h-10 shrink-0 rounded-full border border-solid border-black/[.08] bg-white/70 px-4 text-sm font-medium transition-colors hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/[.145] dark:bg-black/40 dark:hover:bg-black/60"
        >
          {isLoading ? "Checking..." : "List keys"}
        </button>
      </div>
    </section>
  );
}

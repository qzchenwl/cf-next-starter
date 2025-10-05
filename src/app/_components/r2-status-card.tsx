"use client";

import { useState } from "react";

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

  let statusMessage = "Click the button to list a few objects from your R2 bucket.";

  if (isLoading) {
    statusMessage = "Querying R2 bucket...";
  } else if (objects) {
    if (objects.length === 0) {
      statusMessage = "Connected! The bucket is currently empty.";
    } else {
      const countLabel = objects.length === 1 ? "object" : "objects";
      statusMessage = `Connected! Showing ${objects.length} ${countLabel} from the bucket.`;
    }
  } else if (error) {
    statusMessage = error;
  }

  return (
    <section className="w-full max-w-xl rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white/60 dark:bg-black/40 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full">
          <h2 className="text-base font-semibold">Cloudflare R2 connection check</h2>
          <p className="mt-1 text-sm text-black/80 dark:text-white/80">{statusMessage}</p>

          {objects && objects.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-black/80 dark:text-white/80">
              {objects.map((object) => (
                <li key={object.key} className="rounded-md bg-black/[.04] p-2 dark:bg-white/[.06]">
                  <p className="font-medium break-all">{object.key}</p>
                  <p className="text-xs text-black/70 dark:text-white/70">
                    {object.size} bytes
                    {object.uploaded ? ` • uploaded ${new Date(object.uploaded).toUTCString()}` : null}
                  </p>
                </li>
              ))}
              {isTruncated ? (
                <li className="text-xs text-black/70 dark:text-white/70">
                  Showing the first {objects.length} items. Add a prefix or pagination to fetch more.
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCheckBucket}
          disabled={isLoading}
          className="h-10 shrink-0 rounded-full border border-solid border-black/[.08] bg-white/70 px-4 text-sm font-medium transition-colors hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/[.145] dark:bg-black/40 dark:hover:bg-black/60"
        >
          {isLoading ? "Checking..." : "List objects"}
        </button>
      </div>
    </section>
  );
}

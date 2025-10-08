import * as Sentry from '@sentry/cloudflare';
// @ts-expect-error `.open-next/worker.ts` is generated at build time
import worker from './.open-next/worker.js';

function parseSampleRate(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  return parsed >= 0 && parsed <= 1 ? parsed : defaultValue;
}

export default Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.CF_VERSION_METADATA.id,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  worker,
);

// The re-export is only required if your app uses the DO Queue and DO Tag Cache
// See https://opennext.js.org/cloudflare/caching for details
// @ts-expect-error `.open-next/worker.ts` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';

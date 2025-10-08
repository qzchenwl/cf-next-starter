// @ts-expect-error -- `.open-next/worker.ts` is generated at build time
import worker from './.open-next/worker.js';
import * as Sentry from '@sentry/cloudflare';

function parseSampleRate(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

const sentryWorker = Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.CF_VERSION_METADATA.id,
    tracesSampleRate: parseSampleRate(env.SENTRY_TRACES_SAMPLE_RATE, 1),
    enableLogs: true,
  }),
  worker,
);

export default sentryWorker;

// The re-export is only required if your app uses the DO Queue and DO Tag Cache
export const { DOQueueHandler, DOShardedTagCache } = worker;

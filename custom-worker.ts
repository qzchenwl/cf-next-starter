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

const wrappedWorker = Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.CF_VERSION_METADATA.id,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  worker,
);

export default wrappedWorker;

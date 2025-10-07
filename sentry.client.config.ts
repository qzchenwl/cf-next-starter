import * as Sentry from '@sentry/nextjs';
import { replayIntegration } from '@sentry/nextjs';

function parseSampleRate(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : defaultValue;
}

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const tracesSampleRate = parseSampleRate(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, 1);
const replaysSessionSampleRate = parseSampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0);
const replaysOnErrorSampleRate = parseSampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1);

const integrations: Sentry.Integration[] = [];

if (replaysSessionSampleRate > 0 || replaysOnErrorSampleRate > 0) {
  // `replayIntegration` ships with `@sentry/nextjs`, so no extra replay package is required.
  integrations.push(replayIntegration());
}

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate,
  replaysSessionSampleRate,
  replaysOnErrorSampleRate,
  integrations,
});

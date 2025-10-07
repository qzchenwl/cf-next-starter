import * as Sentry from '@sentry/nextjs';

function parseSampleRate(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : defaultValue;
}

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
const tracesSampleRate = parseSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE, 0);
const profilesSampleRate = parseSampleRate(process.env.SENTRY_PROFILES_SAMPLE_RATE, 0);

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate,
  profilesSampleRate,
});

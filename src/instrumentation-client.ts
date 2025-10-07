// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import type { Integration } from '@sentry/core';

function parseSampleRate(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const sentryTracesSampleRate = parseSampleRate(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, 1);
const sentryReplaysSessionSampleRate = parseSampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0);
const sentryReplaysOnErrorSampleRate = parseSampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1);

const sentryIntegrations: Integration[] = [];
if (sentryReplaysSessionSampleRate > 0 || sentryReplaysOnErrorSampleRate > 0) {
  // `replayIntegration` ships with `@sentry/nextjs`, so no extra replay package is required.
  sentryIntegrations.push(Sentry.replayIntegration());
}

Sentry.init({
  dsn: sentryDsn,

  // Add optional integrations for additional features
  integrations: sentryIntegrations,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: sentryTracesSampleRate,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: sentryReplaysSessionSampleRate,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: sentryReplaysOnErrorSampleRate,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

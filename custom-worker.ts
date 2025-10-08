import * as Sentry from '@sentry/cloudflare';
// @ts-expect-error `.open-next/worker.ts` is generated at build time
import worker from './.open-next/worker.js';

const sentryEnhancedWorker = Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.CF_VERSION_METADATA?.id,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  worker,
);

const boundFetch = sentryEnhancedWorker.fetch?.bind(sentryEnhancedWorker);

// Ensure we surface unexpected errors while keeping the Sentry instrumentation.
sentryEnhancedWorker.fetch = async (request, env, ctx) => {
  if (boundFetch) {
    try {
      return await boundFetch(request, env, ctx);
    } catch (error) {
      if (error instanceof Error) {
        return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
      } else {
        return Response.json({ error: `Unknown error occurred: ${error}` });
      }
    }
  } else {
    return Response.json({ error: 'Fetch handler missing from Sentry-wrapped worker' }, { status: 500 });
  }
};

export default sentryEnhancedWorker;

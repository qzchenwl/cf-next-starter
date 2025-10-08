import * as Sentry from '@sentry/cloudflare';
// @ts-expect-error `.open-next/worker.ts` is generated at build time
import worker from './.open-next/worker.js';

const sentryEnhancedWorker = Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.SENTRY_RELEASE,
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
        return Response.json(
          { error: 'Unexpected server error', message: error.message, stack: error.stack },
          { status: 500 },
        );
      } else {
        return Response.json({ error: 'Unexpected server error', detail: String(error) }, { status: 500 });
      }
    }
  } else {
    return Response.json({ error: 'Fetch handler unavailable on Sentry-wrapped worker' }, { status: 500 });
  }
};

export default sentryEnhancedWorker;

// The re-export is only required if your app uses the DO Queue and DO Tag Cache
// See https://opennext.js.org/cloudflare/caching for details
// @ts-expect-error `.open-next/worker.ts` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';

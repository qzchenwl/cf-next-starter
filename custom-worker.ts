import { instrument, type ResolveConfigFn } from '@microlabs/otel-cf-workers';
import * as Sentry from '@sentry/cloudflare';
// @ts-expect-error `.open-next/worker.ts` is generated at build time
import worker from './.open-next/worker.js';

const resolveOtelConfig: ResolveConfigFn = (env) => {
  const exporterUrl = env.SIGNOZ_EXPORTER_URL ?? 'http://localhost:4318/v1/traces';
  const serviceName = env.SIGNOZ_SERVICE_NAME ?? 'cf-next-starter';

  let headers: Record<string, string> | undefined;
  if (env.SIGNOZ_EXPORTER_HEADERS) {
    try {
      headers = JSON.parse(env.SIGNOZ_EXPORTER_HEADERS);
    } catch (error) {
      console.warn('SIGNOZ_EXPORTER_HEADERS is not valid JSON. Falling back to no headers.', error);
    }
  }

  return {
    exporter: {
      url: exporterUrl,
      headers,
    },
    service: { name: serviceName },
  };
};

const sentryEnhancedWorker = Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.SENTRY_RELEASE,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  worker,
);

const otelInstrumentedWorker = instrument(sentryEnhancedWorker, resolveOtelConfig);

const boundFetch = otelInstrumentedWorker.fetch?.bind(otelInstrumentedWorker);

// Ensure we surface unexpected errors while keeping the Sentry instrumentation.
otelInstrumentedWorker.fetch = async (request, env, ctx) => {
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
    return Response.json({ error: 'Fetch handler unavailable on instrumented worker' }, { status: 500 });
  }
};

export default otelInstrumentedWorker;

// The re-export is only required if your app uses the DO Queue and DO Tag Cache
// See https://opennext.js.org/cloudflare/caching for details
// @ts-expect-error `.open-next/worker.ts` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';

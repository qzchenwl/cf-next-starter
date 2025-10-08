import * as Sentry from '@sentry/cloudflare';
// @ts-expect-error `.open-next/worker.ts` is generated at build time
import worker from './.open-next/worker.js';

const wrappedWorker = Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.CF_VERSION_METADATA.id,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  worker,
);

const originalFetch = wrappedWorker.fetch?.bind(wrappedWorker);

wrappedWorker.fetch = async (request, env, ctx) => {
  if (originalFetch) {
    try {
      return await originalFetch(request, env, ctx);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        return Response.json({ error: err?.['message'] || err.stack || '' });
      } else {
        return Response.json({ error: `Unknown error occurred: ${err}` });
      }
    }
  } else {
    return Response.json({ error: 'no fetch in wrappedWorker' });
  }
};

export default wrappedWorker;

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

wrappedWorker.fetch = async (request, env, ctx) => {
  if (wrappedWorker.fetch) {
    try {
      return await wrappedWorker.fetch(request, env, ctx);
    } catch (err) {
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

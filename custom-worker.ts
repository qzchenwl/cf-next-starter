import * as Sentry from '@sentry/cloudflare';

// @ts-expect-error `.open-next/worker.js` is generated at build time
import worker from './.open-next/worker.js';

export default Sentry.withSentry(
  (env: CloudflareEnv) => ({
    dsn: env.SENTRY_DSN,
    release: env.CF_VERSION_METADATA?.id,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  worker,
);

// The re-export is only required if your app uses the DO Queue and DO Tag Cache
// See https://opennext.js.org/cloudflare/caching for details
// @ts-expect-error `.open-next/worker.js` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';

import * as Sentry from '@sentry/nextjs';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function register() {
  const { env } = await getCloudflareContext({ async: true });
  console.log('instrumentation', env);
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;

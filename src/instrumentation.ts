import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as Sentry from '@sentry/nextjs';

import { primeSentryDsn } from '../sentry.config.shared';

async function ensureSentryDsn() {
  primeSentryDsn(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN);

  if (globalThis.__SENTRY_DSN__) {
    return;
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    primeSentryDsn(env?.SENTRY_DSN);
  } catch {
    // No Cloudflare context is available during build-time or local scripts.
  }
}

export async function register() {
  await ensureSentryDsn();

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;

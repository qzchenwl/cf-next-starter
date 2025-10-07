export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');

    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');

    return;
  }

  if (typeof window === 'undefined') {
    await import('./sentry.server.config');
  } else {
    await import('./sentry.client.config');
  }
}

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';

export const dynamic = 'force-dynamic';
class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}
// A faulty API route to test Sentry's error monitoring
export function GET() {
  const error = new SentryExampleAPIError('This error is raised on the backend called by the example page.');
  Sentry.captureException(error, {
    user: {
      id: 'foo-user-id',
      username: 'foo-user',
      email: 'foo-user-email@x.com',
    },
    tags: {
      foo: 'bar',
    },
    extra: {
      foo: 'bar',
    },
  });

  throw error;
  return NextResponse.json({ data: 'Testing Sentry Error...' });
}

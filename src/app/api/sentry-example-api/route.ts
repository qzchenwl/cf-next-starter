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

  console.log('SentryExampleAPIError');
  Sentry.withScope((scope) => {
    scope.setLevel('error');
    Sentry.captureException(error);
  });

  throw error;
  return NextResponse.json({ data: 'Testing Sentry Error...' });
}

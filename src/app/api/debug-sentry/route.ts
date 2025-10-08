import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';

export async function POST() {
  try {
    await Sentry.startSpan(
      {
        op: 'task',
        name: 'status-card.debug-sentry',
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        throw new Error('Manual Sentry test event triggered from the dashboard.');
      },
    );

    return NextResponse.json({
      ok: true,
      error: 'No error was thrown during the test run.',
    });
  } catch (error) {
    const errorToReport = error instanceof Error ? error : new Error('Unknown Sentry test error');

    Sentry.captureException(errorToReport);
    await Sentry.flush(2000);

    return NextResponse.json(
      {
        ok: false,
        error: 'Triggered a test error. Visit your Sentry project to confirm the event was received.',
      },
      { status: 500 },
    );
  }
}

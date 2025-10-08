import * as Sentry from '@sentry/cloudflare';
import { NextResponse } from 'next/server';

type SentryTestResponse =
  | {
      ok: true;
      message: string;
      eventId: string | null;
    }
  | {
      ok: false;
      error: string;
    };

export async function POST() {
  try {
    const eventId = await Sentry.startSpan(
      {
        name: 'sentry.status-card.test',
        op: 'diagnostics',
        attributes: {
          component: 'SentryStatusCard',
        },
      },
      async () => {
        const id = Sentry.captureMessage('Sentry Cloudflare integration test event', 'info');
        await Sentry.flush(2000);
        return id ?? null;
      },
    );

    const payload: SentryTestResponse = {
      ok: true,
      message: 'Sent a diagnostic event to Sentry. Check your project to confirm it arrived.',
      eventId,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Failed to send Sentry diagnostic event', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    const payload: SentryTestResponse = {
      ok: false,
      error: message,
    };

    return NextResponse.json(payload, { status: 500 });
  }
}

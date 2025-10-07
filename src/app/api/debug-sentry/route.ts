import * as Sentry from '@sentry/cloudflare';

export const runtime = 'edge';

export async function GET() {
  await Sentry.startSpan(
    {
      op: 'debug',
      name: 'Sentry debug endpoint',
    },
    async () => {
      throw new Error('Sentry debug endpoint triggered');
    },
  );

  return new Response('', { status: 204 });
}

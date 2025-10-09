import { NextResponse } from 'next/server';

const MAX_SLEEP_MS = 5 * 60_000; // 5 minutes

function parseSleepParam(url: string) {
  const { searchParams } = new URL(url);
  const sleepParam = searchParams.get('sleep');

  if (!sleepParam) {
    return { error: 'Missing "sleep" query parameter specifying the duration in milliseconds.' } as const;
  }

  const sleepMs = Number.parseInt(sleepParam, 10);

  if (!Number.isFinite(sleepMs) || sleepMs < 0) {
    return { error: 'The "sleep" value must be a non-negative integer representing milliseconds.' } as const;
  }

  if (sleepMs > MAX_SLEEP_MS) {
    return {
      error: `The requested sleep duration exceeds the maximum of ${MAX_SLEEP_MS} milliseconds.`,
    } as const;
  }

  return { sleepMs } as const;
}

export async function GET(request: Request) {
  const result = parseSleepParam(request.url);

  if ('error' in result) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
      },
      { status: 400 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, result.sleepMs));

  return NextResponse.json({
    ok: true,
    sleptMs: result.sleepMs,
  });
}

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';

type KvKeyInfo = {
  name: string;
  expiration: number | null;
};

type KvListResponse =
  | {
      ok: true;
      keys: KvKeyInfo[];
      listComplete: boolean;
    }
  | {
      ok: false;
      error: string;
    };

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const listResult = await env.KV.list({ limit: 5 });

    const keys: KvKeyInfo[] = listResult.keys.map((key) => ({
      name: key.name,
      expiration: key.expiration ?? null,
    }));

    const payload: KvListResponse = {
      ok: true,
      keys,
      listComplete: listResult.list_complete ?? true,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Failed to query KV', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    const payload: KvListResponse = {
      ok: false,
      error: message,
    };

    return NextResponse.json(payload, { status: 500 });
  }
}

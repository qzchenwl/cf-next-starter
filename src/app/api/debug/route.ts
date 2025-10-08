import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';

type DebugEnvResponse = {
  runtimeEnv: Record<string, string | null>;
  processEnv: Record<string, string | null>;
};

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });

  const runtimeEnv: Record<string, string | null> = {};

  for (const [key, value] of Object.entries(env)) {
    if (value == null) {
      runtimeEnv[key] = null;
      continue;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      runtimeEnv[key] = String(value);
      continue;
    }

    runtimeEnv[key] = Object.prototype.toString.call(value);
  }

  const processEnv: Record<string, string | null> = {};

  if (typeof process !== 'undefined' && process.env) {
    for (const [key, val] of Object.entries(process.env)) {
      processEnv[key] = val ?? null;
    }
  }

  const payload: DebugEnvResponse = {
    runtimeEnv,
    processEnv,
  };

  return NextResponse.json(payload);
}

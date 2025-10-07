import { getCloudflareContext } from '@opennextjs/cloudflare';
import { toNextJsHandler } from 'better-auth/next-js';

import { createAuth } from '@/lib/auth';

async function handle(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const auth = await createAuth(env);
  return auth.handler(request);
}

export const { GET, POST } = toNextJsHandler({ handler: handle });

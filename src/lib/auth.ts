import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';

import * as authSchema from '@/db/auth-schema';
import { sendVerificationEmail } from '@/lib/email';

const fallbackTrustedOrigins = ['http://localhost:8787', '*.workers.dev'];

export const baseBetterAuthOptions: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail,
  },
};

export function parseTrustedOrigins(rawOrigins?: string | null): string[] {
  if (!rawOrigins) {
    return [...fallbackTrustedOrigins];
  }

  const parsed = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return parsed.length > 0 ? parsed : [...fallbackTrustedOrigins];
}

export async function createAuth(env: CloudflareEnv) {
  const trustedOrigins = parseTrustedOrigins(env.BETTER_AUTH_TRUSTED_ORIGINS);

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(drizzleD1(env.D1, { schema: authSchema }), {
      provider: 'sqlite',
      schema: authSchema,
    }),
    ...baseBetterAuthOptions,
    trustedOrigins,
  });
}

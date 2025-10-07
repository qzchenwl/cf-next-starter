import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql/sqlite3';

import { baseBetterAuthOptions, parseTrustedOrigins } from '@/lib/auth';

// https://www.answeroverflow.com/m/1362463260636479488#solution-1362464191663046908
const fakeAuth = betterAuth({
  database: drizzleAdapter(drizzleSqlite('file:mock.db'), { provider: 'sqlite' }),
  ...baseBetterAuthOptions,
  trustedOrigins: parseTrustedOrigins(process.env.BETTER_AUTH_TRUSTED_ORIGINS),
});

export const auth = fakeAuth;

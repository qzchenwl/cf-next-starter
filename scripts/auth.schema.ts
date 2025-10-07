import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql/sqlite3';

import { baseBetterAuthOptions } from '@/lib/auth';

// https://www.answeroverflow.com/m/1362463260636479488#solution-1362464191663046908
const fakeAuth = betterAuth({
  database: drizzleAdapter(drizzleSqlite('file:mock.db'), { provider: 'sqlite' }),
  ...baseBetterAuthOptions,
});

export const auth = fakeAuth;

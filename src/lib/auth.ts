import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleSqlite } from "drizzle-orm/libsql/sqlite3";

const betterAuthOptions: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
  },
};

// https://www.answeroverflow.com/m/1362463260636479488#solution-1362464191663046908
const fakeAuth = betterAuth({
  database: drizzleAdapter(drizzleSqlite("file:mock.db"), { provider: "sqlite" }),
  ...betterAuthOptions,
});

export const auth = fakeAuth;

export async function createAuth(env: CloudflareEnv) {
  return betterAuth({
    database: drizzleAdapter(drizzleD1(env.D1), { provider: "sqlite" }),
    ...betterAuthOptions,
  });
}

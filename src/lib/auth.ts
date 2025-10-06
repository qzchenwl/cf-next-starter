import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";

import * as authSchema from "@/db/auth-schema"; // 按你的实际路径改

export const betterAuthOptions: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
  },
};

export async function createAuth(env: CloudflareEnv) {
  return betterAuth({
    database: drizzleAdapter(drizzleD1(env.D1, { schema: authSchema }), {
      provider: "sqlite",
      schema: authSchema,
    }),
    ...betterAuthOptions,
  });
}

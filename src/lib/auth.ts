import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";

import * as authSchema from "@/db/auth-schema"; // 按你的实际路径改
import { deliverVerificationEmail } from "@/lib/resend";
import { sharedBetterAuthOptions } from "./auth-options";

export const betterAuthOptions: BetterAuthOptions = {
  ...sharedBetterAuthOptions,
  emailAndPassword: {
    ...sharedBetterAuthOptions.emailAndPassword,
  },
  emailVerification: {
    ...sharedBetterAuthOptions.emailVerification,
  },
};

export async function createAuth(env: CloudflareEnv) {
  return betterAuth({
    database: drizzleAdapter(drizzleD1(env.D1, { schema: authSchema }), {
      provider: "sqlite",
      schema: authSchema,
    }),
    ...betterAuthOptions,
    emailAndPassword: {
      ...betterAuthOptions.emailAndPassword,
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      ...betterAuthOptions.emailVerification,
      sendVerificationEmail: async ({ user, url }) => {
        try {
          await deliverVerificationEmail(env, {
            to: {
              email: user.email,
              name: user.name,
            },
            verificationUrl: url,
          });
        } catch (error) {
          console.error("Failed to send verification email", error);
          throw error;
        }
      },
    },
  });
}

export type AuthInstance = Awaited<ReturnType<typeof createAuth>>;

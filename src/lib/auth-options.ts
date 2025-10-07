import type { BetterAuthOptions } from "better-auth";

export const sharedBetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
  },
  trustedOrigins: ["http://localhost:8787", "*.workers.dev", "*.cwllll.com"],
} satisfies BetterAuthOptions;

import { createAuthClient } from "better-auth/react";

import { sharedBetterAuthOptions } from "./auth-options";

type AuthClientOptions = {
  $InferAuth: typeof sharedBetterAuthOptions;
};

const baseAuthClient = createAuthClient<AuthClientOptions>({
  $InferAuth: sharedBetterAuthOptions,
});

type BaseAuthClient = typeof baseAuthClient;

type VerificationResult = Awaited<ReturnType<BaseAuthClient["signIn"]["email"]>>;

type ExtendedAuthClient = BaseAuthClient & {
  emailVerification: {
    sendVerificationEmail: (data: {
      email: string;
      callbackURL?: string;
    }) => Promise<VerificationResult>;
  };
};

export const authClient = baseAuthClient as ExtendedAuthClient;

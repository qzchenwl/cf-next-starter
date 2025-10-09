import './cloudflare-env.d.ts';

declare global {
  interface CloudflareEnv {
    RESEND_API_KEY: string;
    BETTER_AUTH_SECRET: string;
    SENTRY_RELEASE: string;
    BETTER_AUTH_GOOGLE_CLIENT_ID: string;
    BETTER_AUTH_GOOGLE_CLIENT_SECRET: string;
  }
}

export {};

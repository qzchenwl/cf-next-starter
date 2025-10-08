import './cloudflare-env.d.ts';

declare global {
  interface CloudflareEnv {
    RESEND_API_KEY: string;
    BETTER_AUTH_SECRET: string;
    SENTRY_RELEASE: string;
  }
}

export {};

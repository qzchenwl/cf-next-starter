import './cloudflare-env.d.ts';

declare global {
  interface CloudflareEnv {
    RESEND_API_KEY: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_TRUSTED_ORIGINS: Cloudflare.Env['BETTER_AUTH_TRUSTED_ORIGINS'] | string;
  }
}

export {};

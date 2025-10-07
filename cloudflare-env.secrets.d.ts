import './cloudflare-env.d.ts';

declare global {
  interface CloudflareEnv {
    RESEND_API_KEY: string;
  }
}

export {};

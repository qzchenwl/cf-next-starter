import './cloudflare-env.d.ts';

declare global {
  interface CloudflareEnv {
    CF_VERSION_METADATA: {
      id: string;
    };
    SENTRY_DSN: string;
    SENTRY_TRACES_SAMPLE_RATE?: string;
  }
}

export {};

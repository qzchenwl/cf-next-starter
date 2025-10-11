import './cloudflare-env.d.ts';

declare global {
  interface CloudflareEnv {
    SIGNOZ_EXPORTER_URL?: string;
    SIGNOZ_SERVICE_NAME?: string;
    SIGNOZ_EXPORTER_HEADERS?: string;
  }
}

export {};

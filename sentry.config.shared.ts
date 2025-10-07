export type SentryBaseConfig = {
  dsn?: string;
  enabled: boolean;
  tracesSampleRate: number;
  enableLogs: boolean;
  debug: boolean;
};

declare global {
  var __SENTRY_DSN__: string | undefined;
}

function setGlobalDsn(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.__SENTRY_DSN__ = value;
  }

  return true;
}

export function primeSentryDsn(value?: string | null): void {
  if (globalThis.__SENTRY_DSN__) {
    return;
  }

  setGlobalDsn(value);
}

export function resolveSentryDsn(): string | undefined {
  if (typeof globalThis !== 'undefined' && globalThis.__SENTRY_DSN__) {
    return globalThis.__SENTRY_DSN__;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? undefined;
  }

  return undefined;
}

export function createBaseSentryConfig(): SentryBaseConfig {
  const dsn = resolveSentryDsn();

  return {
    dsn,
    enabled: Boolean(dsn),
    tracesSampleRate: 1,
    enableLogs: true,
    debug: false,
  };
}

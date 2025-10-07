import * as Sentry from '@sentry/cloudflare';
import worker from '../.open-next/worker';

type Env = CloudflareEnv & {
  CF_VERSION_METADATA: WorkerVersionMetadata;
  SENTRY_DSN?: string;
  SENTRY_TRACES_SAMPLE_RATE?: string;
  SENTRY_ENABLE_LOGS?: string;
};

const truthyValues = new Set(['1', 'true', 'yes', 'on']);
const falsyValues = new Set(['0', 'false', 'no', 'off']);

const parseBoolean = (value?: string) => {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (truthyValues.has(normalized)) {
    return true;
  }
  if (falsyValues.has(normalized)) {
    return false;
  }

  return undefined;
};

const parseNumber = (value?: string) => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default Sentry.withSentry((env: Env) => {
  const tracesSampleRate = parseNumber(env.SENTRY_TRACES_SAMPLE_RATE);
  const enableLogs = parseBoolean(env.SENTRY_ENABLE_LOGS);

  return {
    dsn: env.SENTRY_DSN,
    release: env.CF_VERSION_METADATA?.id,
    tracesSampleRate,
    enableLogs: enableLogs ?? false,
  };
}, worker);

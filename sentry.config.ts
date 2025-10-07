import type { SentryBuildOptions } from '@sentry/nextjs';

const config: SentryBuildOptions = {
  org: 'cwl',
  project: 'cf-next-starter',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
};

export default config;

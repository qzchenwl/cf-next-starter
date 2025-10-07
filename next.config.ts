import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  /* config options here */
};

const sentryOrg = process.env.SENTRY_ORG ?? process.env.NEXT_PUBLIC_SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT ?? process.env.NEXT_PUBLIC_SENTRY_PROJECT;
// The auth token must remain private; exposing a NEXT_PUBLIC variant would leak it to the browser bundle.
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const shouldUploadSourceMaps = Boolean(sentryOrg && sentryProject && sentryAuthToken);

export default withSentryConfig(nextConfig, {
  authToken: sentryAuthToken,
  org: sentryOrg,
  project: sentryProject,
  silent: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  dryRun: !shouldUploadSourceMaps,
});

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();

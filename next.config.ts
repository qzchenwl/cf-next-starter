import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

import sentryConfig from './sentry.config';

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, sentryConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({
  // Uncomment to enable R2 cache,
  // It should be imported as:
  // `import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";`
  // See https://opennext.js.org/cloudflare/caching for more details
  // incrementalCache: r2IncrementalCache,
});

// The Cloudflare builder runs through `npm run cf:build`, which proxies to the OpenNext CLI.
// Without this override the CLI would call `npm run build` recursively, so we point it to
// the dedicated Next.js compilation script instead.
config.buildCommand = "npm run next:build";

export default config;

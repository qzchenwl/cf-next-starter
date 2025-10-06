This is a [Next.js](https://nextjs.org) starter tailored for [Cloudflare Workers](https://developers.cloudflare.com/workers/) deployments using the OpenNext adapter.

## Getting Started

Install dependencies and launch the Cloudflare-local development server:

```bash
npm install
npm run dev
```

The script first packages the Worker bundle with `npm run cf:build` (which runs the OpenNext Cloudflare builder and, in turn, executes the default `npm run build` Next.js compilation), then launches `wrangler dev --local` so the Worker is available at [http://localhost:8787](http://localhost:8787). The landing page now includes a live connectivity check against the provisioned Cloudflare D1 database.

You can start editing the UI by modifying `src/app/page.tsx`. API routes live alongside the App Router at `src/app/api/*`.

## Cloudflare D1 integration

The project is pre-wired to use the `cf-next-starter-d1` database that was created with Wrangler:

- `wrangler.jsonc` declares the `D1` binding.
- `cloudflare-env.d.ts` exposes the binding in TypeScript so you can access it through `getCloudflareContext()` (or the `cloudflare:env` module within Worker code).
- `src/app/api/d1/route.ts` and the home page demonstrate how to query the database with a simple `SELECT datetime('now')` statement.

### Managing migrations

Drizzle Kit drives schema changes for the D1 database declared in `wrangler.jsonc`:

```bash
# create SQL from the current schema definitions
npx drizzle-kit generate

# quickly push an updated schema without creating a migration file
npx drizzle-kit push

# apply migrations in each environment with Wrangler
npx wrangler d1 migrations apply cf-next-starter-d1-preview --remote --env preview
npx wrangler d1 migrations apply cf-next-starter-d1 --remote
npx wrangler d1 migrations apply cf-next-starter-d1 --local
```

Both `npm run deploy` and `npm run preview` trigger the Cloudflare Wrangler migration step automatically via npm pre-scripts (`predeploy` → `precf:deploy` and `prepreview` → `precf:preview`), so the latest migrations are applied before the Worker is published. Use the preview script whenever you want to push through the Cloudflare Versions API:

```bash
npm run preview
```

Set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, and `CLOUDFLARE_D1_TOKEN` in the environment running the scripts so Drizzle can authenticate against the target database. Whenever you add new bindings or tables, re-run `npm run cf-typegen` to refresh the strongly-typed environment bindings. If you prefer to skip the wrappers that Cloudflare Dash consumes, the lower-level commands `npm run cf:deploy` and `npm run cf:preview` are also available and reuse the same migration hooks.

## Cloudflare R2 integration

Object storage is available out of the box through the `cf-next-starter-r2` bucket:

- `wrangler.jsonc` declares the `R2` bucket binding.
- `cloudflare-env.d.ts` exposes the binding in TypeScript.
- `src/app/api/r2/route.ts` lists the first few objects stored in the bucket so you can quickly verify access.
- The home page renders an R2 status card alongside the D1 widget so you can trigger the API call from the UI.

Re-run `npm run cf-typegen` after changing the binding name or adding additional buckets to keep the TypeScript definitions in sync.

## Cloudflare KV integration

The starter now includes a `cf-next-starter-kv` namespace for key-value storage:

- `wrangler.jsonc` declares the `KV` binding and links it to the provisioned namespace (ID `418b43fc589842d088cc79d412a12222`).
- `cloudflare-env.d.ts` exposes the binding so you can access the namespace with full type safety.
- `src/app/api/kv/route.ts` fetches a short list of keys to validate connectivity.
- The home page features a KV status card that lets you verify the namespace from the browser.

Remember to run `npm run cf-typegen` after updating the binding name or adding additional namespaces.

## Storybook UI development

Run the interactive component workbench on [http://localhost:6006](http://localhost:6006):

```bash
npm run storybook
```

Stories live alongside your components (for example `*.stories.tsx`). Global styles from `src/app/globals.css` are automatically applied so the preview matches the Next.js app. The Storybook Vitest addon is configured, enabling interaction and accessibility testing widgets directly in the UI.

Generate a static Storybook bundle for publishing or sharing with teammates:

```bash
npm run build-storybook
```

## Testing

Component tests use [Vitest](https://vitest.dev/) together with [Testing Library](https://testing-library.com/docs/react-testing-library/intro/):

```bash
npm test          # run the full suite once
npm run test:watch # rerun relevant tests on change
npm run test:coverage # produce an HTML + lcov coverage report
```

The configuration loads Testing Library matchers globally and adds Storybook stories as browser-based tests. Coverage output lives in `coverage/`, while CI runs additionally write a JUnit report to `reports/vitest-junit.xml` for workflow summaries.

> [!NOTE]
> The first time you run the suite locally, execute `npx playwright install --with-deps chromium` to download the headless browser and the Linux dependencies Storybook Test requires.

## Continuous integration

Every push and pull request triggers `.github/workflows/test.yml`. The workflow installs dependencies, lints the project, runs `npm run test:ci` (which includes Storybook-powered tests and coverage), and uploads the resulting reports as build artifacts. When the pull request originates from this repository (not a fork), the workflow also annotates the discussion with the Vitest summary.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – learn about features and APIs.
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/) – explore SQL capabilities, migrations, and tooling.
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) – understand how the adapter deploys your Next.js app.

## Deployment

Use OpenNext and Wrangler to build and deploy the Worker bundle (the top-level scripts proxy to their Cloudflare-specific counterparts):

```bash
npm run build
npm run deploy
```

Refer to the [Cloudflare deployment guide](https://developers.cloudflare.com/workers/wrangler/deploy-projects/) for additional details.

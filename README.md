This is a [Next.js](https://nextjs.org) starter tailored for [Cloudflare Workers](https://developers.cloudflare.com/workers/) deployments using the OpenNext adapter.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The landing page now includes a live connectivity check against the provisioned Cloudflare D1 database.

You can start editing the UI by modifying `src/app/page.tsx`. API routes live alongside the App Router at `src/app/api/*`.

## Cloudflare D1 integration

The project is pre-wired to use the `cf-next-starter-d1` database that was created with Wrangler:

- `wrangler.jsonc` declares the `D1` binding.
- `cloudflare-env.d.ts` exposes the binding in TypeScript so you can access it through `getCloudflareContext()` (or the `cloudflare:env` module within Worker code).
- `src/app/api/d1/route.ts` and the home page demonstrate how to query the database with a simple `SELECT datetime('now')` statement.

### Managing migrations

Create a migrations directory and generate your first migration:

```bash
mkdir -p migrations
wrangler d1 migrations create cf-next-starter-d1 init
```

Apply migrations locally or remotely:

```bash
wrangler d1 migrations apply cf-next-starter-d1 --local
# or deploy to Cloudflare
wrangler d1 migrations apply cf-next-starter-d1
```

Whenever you add new bindings or tables, re-run `npm run cf-typegen` to refresh the strongly-typed environment bindings.

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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – learn about features and APIs.
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/) – explore SQL capabilities, migrations, and tooling.
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) – understand how the adapter deploys your Next.js app.

## Deployment

Use Wrangler to build and deploy the Worker bundle:

```bash
npm run cf:build
npm run deploy
```

Refer to the [Cloudflare deployment guide](https://developers.cloudflare.com/workers/wrangler/deploy-projects/) for additional details.

## Storybook & visual reviews

Storybook is configured with the official Next.js framework adapter and Testing Library helpers. Run it locally while building components:

```bash
npm run storybook
```

Generate the static build before sharing a preview or capturing UI snapshots:

```bash
npm run build-storybook
```

To help reviewers, capture a screenshot of any story (defaults to the primary button example) after building Storybook:

```bash
npm run storybook:screenshot -- --id=components-button--primary
```

The command uses Playwright to load the requested story and stores the resulting PNG inside `storybook-static/screenshots/`. Pass a different Story ID with `--id` to document other components. Remember to run `npx playwright install` once locally to download the browser binaries.

## Testing

Component and utility tests run through Vitest with @testing-library/react:

```bash
npm test          # one-off run
npm run test:watch
npm run test:coverage
```

CI executions call `npm run test:ci`, which writes a JUnit report to `test-results/junit.xml` for workflow uploads.

## Continuous integration

A reusable GitHub Actions workflow (`.github/workflows/ci.yml`) installs dependencies with caching, runs ESLint, executes the Vitest suite, builds Storybook, and captures the latest Storybook screenshot. Test results and screenshots are attached to each workflow run so pull requests always include up-to-date feedback.

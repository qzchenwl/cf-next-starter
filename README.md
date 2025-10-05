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

- `wrangler.jsonc` declares the `cf_next_starter_d1` binding.
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

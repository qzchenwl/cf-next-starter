# Cloudflare-First Next.js Starter

Launch a production-ready Next.js application that treats Cloudflare Workers as the primary runtime from the very first commit. This starter bundles the tooling, bindings, and deployment workflows you need to ship globally distributed features without wrestling with scaffolding.

## Stack Overview

This template comes preloaded with a modern full-stack toolkit:

- **Next.js App Router** with React Server Components, edge-friendly rendering, and streaming responses
- **TypeScript** configured with strict ESLint rules, Vitest unit testing, and Playwright-ready integration tests
- **Tailwind-compatible PostCSS pipeline** plus CSS Modules for bespoke styling needs
- **OpenNext build pipeline** wired to Cloudflare Workers via Wrangler for deploys and previews
- **Cloudflare bindings** for D1, R2, and KV defined in `wrangler.jsonc` with matching TypeScript declarations
- **Drizzle ORM** with schema-first migrations and type-safe query helpers
- **Storybook workspace** for component-driven development and visual regression review

## Getting Started

Follow this path to fork the project, import it into Cloudflare, and provision the required services.

### 1. Fork the repository
Fork this repo into your GitHub account. Cloudflare will track that fork for automated builds and deployments.

### 2. Import the fork in Cloudflare Dashboard
1. Navigate to **Workers & Pages → Create application → Worker**.
2. Choose **Connect to Git** and select the fork you just created.
3. Authorize the integration and let the initial build complete so Cloudflare links to your `main` branch.

### 3. Provision Cloudflare data services
Create the D1 database, R2 bucket, and KV namespace with Wrangler, then paste the returned IDs into the corresponding bindings inside `wrangler.jsonc`.

```bash
npx wrangler d1 create cf-next-starter-d1
npx wrangler r2 bucket create cf-next-starter-r2
npx wrangler kv namespace create cf-next-starter-kv
# Update wrangler.jsonc with the new identifiers
```

### 4. Generate and apply database migrations
Use Drizzle Kit to generate SQL from the schema and apply the migrations to the remote D1 instance.

```bash
npx drizzle-kit generate
npx drizzle-kit push
npx wrangler d1 migrations apply cf-next-starter-d1 --remote
```

### 5. Develop locally with Cloudflare bindings
Install dependencies and start the Next.js dev server backed by the Cloudflare worker shim.

```bash
npm install
npm run dev
```

Whenever you update bindings or secrets, run `npm run cf-typegen` to refresh `cloudflare-env.d.ts` and keep IntelliSense accurate.

## Feature Highlights

- 🚀 **Cloudflare-native deployment flow** — `npm run preview` and `npm run deploy` orchestrate the OpenNext build, worker upload, and migrations end-to-end.
- 🗄️ **First-class data integrations** — Sample routes illustrate reading and writing with D1, R2, and KV, surfacing live status on the home page.
- 🧰 **Productivity tooling included** — Storybook, Vitest, ESLint, and Playwright (opt-in) ship pre-configured so you can focus on product work.
- 🛡️ **Type-safe platform bindings** — `cloudflare-env.d.ts` enumerates every Worker binding, keeping runtime configuration transparent and type checked.
- 📦 **Modern full-stack architecture** — App Router, server actions, and API routes are scaffolded for edge-friendly features across regions.

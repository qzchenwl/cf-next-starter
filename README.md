# Cloudflare-First Next.js Starter Kit

Launch a production-grade Next.js application that runs natively on Cloudflare Workers from the very first commit. This starter stitches together the platform bindings, developer ergonomics, and CI/CD automation you need to ship edge-ready features without reinventing the scaffolding.

## Technology Pillars

Everything you need for a modern full-stack experience comes prewired:

- **Next.js App Router** with React Server Components, streaming responses, and edge-aware rendering defaults.
- **TypeScript everywhere** with strict configuration, ESLint, Vitest, and Playwright-ready integration tests.
- **Tailwind-friendly styling** via PostCSS and CSS Modules when you need handcrafted components.
- **OpenNext build pipeline** tuned for Wrangler so Workers deployments and previews mirror production.
- **Cloudflare bindings** for D1, R2, and KV declared in `wrangler.jsonc` with matching types in `cloudflare-env.d.ts`.
- **Drizzle ORM** plus schema-first migrations to keep SQL changes predictable and traceable.
- **Storybook workspace** for component-driven development and visual QA.

## Launch in Minutes

Follow this path to fork the project, wire it into your Cloudflare account, and provision the backing services.

1. **Fork the repository** – Create a GitHub fork so Cloudflare can track your branch builds.
2. **Import the fork in Cloudflare Dashboard**:
   - Navigate to **Workers & Pages → Create application → Worker** (or open the account-agnostic shortcut at <https://dash.cloudflare.com/?to=/:account/workers-and-pages/create>).
   - Choose **Connect to Git**, authorize GitHub, and pick your fork.
   - Let the initial build finish so Cloudflare mirrors your `main` branch.
3. **Provision Cloudflare data services** – Create the bindings and paste the identifiers into `wrangler.jsonc`.

   ```bash
   npx wrangler d1 create cf-next-starter-d1
   npx wrangler r2 bucket create cf-next-starter-r2
   npx wrangler kv namespace create cf-next-starter-kv
   # Update wrangler.jsonc with the generated IDs
   ```

4. **Generate and apply database migrations** – Use Drizzle Kit to keep D1 in sync.

   ```bash
   npx wrangler d1 migrations apply cf-next-starter-d1 --remote
   ```

5. **Develop locally with Cloudflare bindings** – Install dependencies and run the dev worker shim.

   ```bash
   npm install
   npm run cf:dev
   ```

   Whenever bindings or secrets change, run `npm run cf-typegen` to refresh `cloudflare-env.d.ts` for accurate IntelliSense.

## Automated Quality Gates

GitHub Actions (`.github/workflows/test.yml`) guard every push and pull request:

- `Test and lint` workflow installs Node.js 20, caches dependencies, and runs `npm ci` for reproducible builds.
- Playwright browsers are provisioned so UI checks stay ready for action when you add end-to-end specs.
- ESLint and the CI-friendly `npm run test:ci` target execute Vitest alongside Playwright, uploading coverage, Vitest JUnit, and Playwright reports as artifacts.
- Failures feed directly into the GitHub Checks UI via `dorny/test-reporter`, helping reviewers triage regressions fast.

## Feature Highlights

- 🚀 **Cloudflare-native deployment flow** – `npm run preview` and `npm run deploy` orchestrate the OpenNext build, worker upload, and migrations end-to-end.
- 🗄️ **First-class data integrations** – Sample routes illustrate reading and writing with D1, R2, and KV, surfacing live status directly in the app shell.
- 🧰 **Productivity tooling included** – Storybook, Vitest, ESLint, and Playwright ship preconfigured so teams can focus on product velocity.
- 🛡️ **Type-safe platform bindings** – `cloudflare-env.d.ts` enumerates every Worker binding, keeping runtime configuration transparent and type checked.
- 📦 **Modern full-stack architecture** – App Router layouts, server actions, and API routes come scaffolded for edge-friendly experiences across regions.
- 🔁 **CI/CD friendly** – Wrangler-compatible commands, artifact uploads, and typed environment contracts keep your GitHub → Cloudflare workflow smooth and auditable.

## Email Verification via Resend

The Better Auth sample flow ships with mandatory email verification. Configure a Resend account and provide the following environment variables (for local development, place them in `.dev.vars`; for deployments, set them in the Worker binding settings):

- `RESEND_API_KEY` – Required. The API key generated in the Resend dashboard.
- `RESEND_FROM_EMAIL` – Required. A verified sender email address (for example, `login@yourdomain.com`).
- `RESEND_FROM_NAME` – Optional. Friendly display name for outgoing messages.

The verification message is implemented as a React email template in [`src/emails/verification-email.tsx`](src/emails/verification-email.tsx), with a Storybook preview under `Emails/VerificationEmail` to make visual tweaks fast.

### Cloudflare environment bindings vs. `process.env`

Cloudflare Workers inject bindings through the `env` argument that surfaces in API routes, middleware, and server actions—**not** `process.env`. That is why the Resend helper receives `env: CloudflareEnv` and reads `env.RESEND_API_KEY`, mirroring the way any Worker binding is accessed at runtime. Node-based tooling (such as `drizzle.config.ts` or Playwright) still uses `process.env` because those scripts execute in your local shell.

Set secrets like `RESEND_API_KEY` with `wrangler secret put RESEND_API_KEY`. Non-secret defaults (for example `RESEND_FROM_EMAIL`) can live in the `vars` block of `wrangler.jsonc`, or you can manage them via the dashboard UI. The starter currently declares D1, R2, and KV bindings in `wrangler.jsonc`; add the Resend values there if you want reproducible previews:

```jsonc
  "vars": {
    "RESEND_FROM_EMAIL": "login@example.com",
    "RESEND_FROM_NAME": "Cloudflare Next Starter"
  }
```

Run `npm run cf-typegen` whenever you add or update bindings so the generated `cloudflare-env.d.ts` stays current.

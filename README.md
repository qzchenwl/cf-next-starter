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
- **Better Auth with React Email** wiring for password sign-in, session storage on D1, and transactional templates rendered with Resend-ready components.
- **Storybook workspace** for component-driven development and visual QA.
- **Automated code hygiene** enforced with Prettier, ESLint, lint-staged, and Lefthook-managed Git hooks plus Commitizen prompts.

## Launch in Minutes

Follow this path to fork the project, wire it into your Cloudflare account, and provision the backing services.

1. **Fork the repository** – Create a GitHub fork so Cloudflare can track your branch builds.
2. **Import the fork in Cloudflare Dashboard**:
   - Navigate to **[Compute (Workers) -> Workers & Pages → Create application → Workers -> Import a repository](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/import-repository)**.
   - Choose **Connect to GitHub**, and pick your fork.
   - Let the initial build finish so Cloudflare mirrors your `main` branch.
3. **Provision Cloudflare data services** – Create the bindings and paste the identifiers into `wrangler.jsonc`.

   ```bash
   npx wrangler d1 create cf-next-starter-d1
   npx wrangler r2 bucket create cf-next-starter-r2
   npx wrangler kv namespace create cf-next-starter-kv
   # for preview environment
   npx wrangler d1 create cf-next-starter-d1-preview
   npx wrangler r2 bucket create cf-next-starter-r2-preview
   npx wrangler kv namespace create cf-next-starter-kv-preview

   # Update wrangler.jsonc with the generated IDs
   ```

4. **Configure authentication secrets and email provider** – Generate a random `BETTER_AUTH_SECRET`, create a Resend API key, and register the default "from" identity used by transactional email.

   ```bash
   wrangler secret put BETTER_AUTH_SECRET
   wrangler secret put RESEND_API_KEY
   # for preview environment
   wrangler secret put BETTER_AUTH_SECRET --env preview
   wrangler secret put RESEND_API_KEY --env preview
   ```

   Update `DEFAULT_EMAIL_FROM_ADDRESS` and `DEFAULT_EMAIL_FROM_NAME` in `wrangler.jsonc` to match your verified sender.

5. **Generate and apply database migrations** – Use Drizzle Kit to keep D1 in sync.

   ```bash
   npx wrangler d1 migrations apply cf-next-starter-d1 --remote
   # for preview environment
   npx wrangler d1 migrations apply cf-next-starter-d1-preview --remote --env preview
   ```

6. **Develop locally with Cloudflare bindings** – Install dependencies and run the dev worker shim.

   ```bash
   npm install
   npm run cf:dev
   ```

   Whenever bindings or secrets change, run `npm run cf-typegen` to refresh `cloudflare-env.d.ts` for accurate IntelliSense.

   Configure Better Auth by setting the `BETTER_AUTH_TRUSTED_ORIGINS` variable in `wrangler.jsonc` (or the Cloudflare dashboard) to a comma-separated list of allowed domains. The Worker falls back to `http://localhost:8787` and `*.workers.dev` when the variable is omitted, which keeps local development frictionless while still letting you tighten origins per environment.

## Automated Quality Gates

GitHub Actions (`.github/workflows/test.yml`) guard every push and pull request:

- `Test and lint` workflow installs Node.js 20, caches dependencies, and runs `npm ci` for reproducible builds.
- Playwright browsers are provisioned so UI checks stay ready for action when you add end-to-end specs.
- ESLint and the CI-friendly `npm run test:ci` target execute Vitest alongside Playwright, uploading coverage, Vitest JUnit, and Playwright reports as artifacts.
- Failures feed directly into the GitHub Checks UI via `dorny/test-reporter`, helping reviewers triage regressions fast.

## Local Guardrails & Commit Workflow

- **Lefthook pre-commit and commit-msg hooks** run `lint-staged` and `commitlint` automatically so formatting and lint rules stay enforced before code lands in the repository.
- **Prettier + ESLint autofix** integrations keep JavaScript, TypeScript, Markdown, and stylesheets consistently formatted across the codebase.
- **Commitizen with cz-git adapter** (`npm run commit`) guides contributors through conventional commit messages that satisfy the commit linting rules and produce clear history.

## Feature Highlights

- 🚀 **Cloudflare-native deployment flow** – `npm run preview` and `npm run deploy` orchestrate the OpenNext build, worker upload, and migrations end-to-end.
- 🗄️ **First-class data integrations** – Sample routes illustrate reading and writing with D1, R2, and KV, surfacing live status directly in the app shell.
- 🧰 **Productivity tooling included** – Storybook, Vitest, ESLint, and Playwright ship preconfigured so teams can focus on product velocity.
- 🛡️ **Type-safe platform bindings** – `cloudflare-env.d.ts` enumerates every Worker binding, keeping runtime configuration transparent and type checked.
- 📦 **Modern full-stack architecture** – App Router layouts, server actions, and API routes come scaffolded for edge-friendly experiences across regions.
- 🔐 **Better Auth flows** – Route handlers, D1-backed session storage, and verification emails rendered with React Email ship ready to customize.
- 🔁 **CI/CD friendly** – Wrangler-compatible commands, artifact uploads, and typed environment contracts keep your GitHub → Cloudflare workflow smooth and auditable.

# what

A Cloudflare-first full-stack starter for Next.js that embraces OpenNext and the Workers platform from day one. The stack ships with:

- Next.js App Router with React Server Components and edge-ready rendering
- TypeScript with strict ESLint rules and Vitest for unit testing
- Tailwind-friendly PostCSS pipeline and CSS Modules support
- OpenNext-powered Cloudflare Worker bundling and deployment scripts
- Pre-wired bindings for Cloudflare D1, R2, and KV in `wrangler.jsonc`
- Drizzle ORM with Drizzle Kit migrations and type-safe schema generation
- Storybook workspace for component-driven development

# how to get started

1. **Fork the repository** – Fork this template into your own GitHub account so Cloudflare can import it later.
2. **Import on Cloudflare Dashboard** – In the Workers & Pages dashboard, create a new Worker and choose the GitHub repository you just forked. Allow the first build to complete so Cloudflare tracks the main branch.
3. **Provision platform resources** – Use Wrangler to create the D1 database, R2 bucket, and KV namespace, then replace the placeholder IDs inside `wrangler.jsonc`.
   ```bash
   npx wrangler d1 create cf-next-starter-d1
   npx wrangler r2 bucket create cf-next-starter-r2
   npx wrangler kv namespace create cf-next-starter-kv
   # Paste the returned identifiers into wrangler.jsonc bindings
   ```
4. **Run database migrations** – Generate SQL from the Drizzle schema, push it to the migrations folder, and apply it to the remote D1 instance.
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit push
   npx wrangler d1 migrations apply cf-next-starter-d1 --remote
   ```
5. **Develop locally** – Install dependencies and start the development worker. The Next.js server proxies through Cloudflare bindings so you can exercise edge APIs.
   ```bash
   npm install
   npm run dev
   ```
6. **Keep type definitions in sync** – Whenever bindings change, run `npm run cf-typegen` to refresh `cloudflare-env.d.ts` and maintain editor IntelliSense.

# feature highlights

- 🚀 **OpenNext + Wrangler deployment flow** – `npm run deploy` and `npm run preview` orchestrate the OpenNext build, worker upload, and migrations in one go.
- 🗄️ **Cloudflare data service demos** – Sample routes show how to read and write from D1, R2, and KV, with UI cards on the home page that reflect live status.
- 🧰 **Productive DX tooling** – Storybook, Vitest, ESLint, and Playwright (optional) arrive pre-configured so you can focus on features instead of setup.
- 🛡️ **Type-safe bindings** – `cloudflare-env.d.ts` enumerates every Worker binding, ensuring runtime secrets stay discoverable while remaining type checked.
- 📦 **Modern Next.js architecture** – App Router, server actions, and API routes are scaffolded and ready for full-stack features across edge regions.

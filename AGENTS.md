# Repository Guidelines

## Architecture Overview

- Next.js App Router project targeting Cloudflare Workers via OpenNext; keep worker-specific configuration in `next.config.ts`, `open-next.config.ts`, and `wrangler.jsonc`.
- Server runtime state (KV, R2, D1) is accessed through `@opennextjs/cloudflare#getCloudflareContext`; avoid using global `process.env` inside request handlers.
- Authentication is centralized in `src/lib/auth.ts` using BetterAuth with the Drizzle adapter. Extend auth flows by updating that factory rather than wiring new handlers ad hoc.
- The Cloudflare D1 schema for BetterAuth lives in `src/db/schema.ts` and is mirrored in `drizzle/0000_gigantic_cargill.sql` plus the metadata snapshot. Update both when adding tables.

## Coding Conventions

- TypeScript everywhere; React components should stay functional. Route handlers must remain the default exports for App Router segments.
- Two-space indentation, PascalCase for components, camelCase for utilities/hooks, and SCREAMING_SNAKE_CASE for runtime env constants.
- Prefer shadcn/ui primitives from `src/components/ui`. Co-locate client components under `src/components` and keep them small and testable.
- For auth UI, reuse the shared `AuthPanel` component instead of duplicating fetch logic across pages.

## Auth Workflow Expectations

- Email+password sign-up must post to `/api/auth/sign-up/email` with a `callbackURL` that lands on `/auth/verify-email`.
- Enforce email verification before issuing sessions; login attempts for unverified users should surface the BetterAuth error message in the UI.
- `sendVerificationEmail` relies on `RESEND_API_KEY` and `RESEND_FROM_EMAIL`; log a warning but do not throw if they are missing so local development still works.
- When adjusting auth, verify cookie handling for Cloudflare Workers (no Node-only APIs) and keep `credentials: "include"` on client fetches.

## Tooling & Verification

- Use the provided npm scripts: `npm run dev`, `npm run build`, `npm run lint`, and `npm run test` (Vitest). Linting is the minimum bar before sending a PR.
- Avoid long-running filesystem scans (`ls -R`, `grep -R`); rely on `rg` for search.
- Commit messages stay imperative and concise. When preparing PRs, summarize auth flows and note any schema changes or new env variables.

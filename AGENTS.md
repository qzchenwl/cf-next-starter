# Repository Guidelines

## Project Structure & Module Organization

- Source lives under `src/app` using the App Router; colocate route components and supporting modules in the relevant folder.
- Global styling stays in `src/app/globals.css`; shared assets go in `public/`.
- Cloudflare integration is configured through `next.config.ts`, `open-next.config.ts`, and `wrangler.jsonc`; platform bindings are typed in `cloudflare-env.d.ts`.

## Build, Test, and Development Commands

- `npm run lint` — ESLint with `next/core-web-vitals` and TypeScript rules.
- `npm run cf:build` — Build the worker bundle without deploying; use in CI.
- `npm run preview` / `npm run deploy` — Build then publish to the requested Cloudflare environment.
- `npm run cf-typegen` — Regenerate `cloudflare-env.d.ts` after changing bindings or secrets.
- `npm run test:ci` — Required validation command before submitting changes.
- `npm run cf:dev` — Start the Cloudflare development server; capture UI screenshots from this instance.

## Coding Style & Naming Conventions

- Write TypeScript and prefer functional React components; keep default exports for pages and layouts.
- Use two-space indentation, PascalCase for React components, camelCase for hooks/utilities, and SCREAMING_SNAKE_CASE for env constants. Keep `package.json` indented with hard tabs.
- Tailwind CSS utilities are available through PostCSS; scope bespoke styles with CSS modules when utilities are insufficient.
- Run `npm run lint` (or `npx eslint . --fix` for autofixes) before pushing.

## Testing Guidelines

- A test runner is not bundled yet; adopt `vitest` + `@testing-library/react` and name files `*.test.tsx` alongside the code they cover.
- Add an `npm test` script (`vitest run` recommended) and keep statement coverage near 80% for new modules; explain exceptions in the PR.
- Until a test suite lands, treat `npm run lint` and deploy previews as required validation.

## Commit & Pull Request Guidelines

- Follow the git history: imperative, present-tense commit titles with optional prefixes like `chore:` or `feat:` when useful.
- Squash WIP commits, provide a concise PR summary, link issues, and attach screenshots or logs for UI or deployment changes.
- Call out infrastructure touches (secrets, bindings, migrations) and checklist the verification steps you performed.

## Cloudflare & Deployment Notes

- `initOpenNextCloudflareForDev` in `next.config.ts` must remain at the bottom so the dev worker hooks in correctly.
- Manage secrets with `wrangler secret put`; mirror non-secret defaults in `cloudflare-env.d.ts` to preserve type safety.
- After editing `wrangler.jsonc`, rerun `npm run cf:build` before requesting review to catch worker regressions.

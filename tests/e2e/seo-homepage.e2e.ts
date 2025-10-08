import { mkdir } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

const seoArtifactsDir = 'artifacts/seo';
const screenshotPath = `${seoArtifactsDir}/home-no-js.png`;

test.describe('homepage seo without javascript', () => {
  test('captures ssr content and metadata', async ({ page, context }) => {
    await page.goto('/');

    await mkdir(seoArtifactsDir, { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await expect(page).toHaveTitle('Cloudflare + Next.js starter');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBe('Check your Cloudflare bindings with a shadcn/ui dashboard.');

    await expect(page.getByRole('heading', { level: 1, name: 'Cloudflare + Next.js starter kit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Deploy to Cloudflare Workers' })).toBeVisible();

    const response = await context.request.get('/');
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    expect(html).toContain('<title>Cloudflare + Next.js starter</title>');
    expect(html).toContain('name="description" content="Check your Cloudflare bindings with a shadcn/ui dashboard."');
    expect(html).toContain('Cloudflare + Next.js starter kit');
  });
});

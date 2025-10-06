import { expect, test } from "@playwright/test";

test.describe("homepage e2e", () => {
  test("displays the primary hero content", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Cloudflare + Next.js starter kit" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Deploy to Cloudflare Workers" })).toBeVisible();
  });
});

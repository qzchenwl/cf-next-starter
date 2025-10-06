import { expect, test } from "@playwright/test";

test.describe("homepage integration", () => {
  test("responds with HTML for the root route", async ({ request }) => {
    const response = await request.get("/");

    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("text/html");

    const body = await response.text();
    expect(body).toContain("Cloudflare + Next.js starter kit");
  });
});

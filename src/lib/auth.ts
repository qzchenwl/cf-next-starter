import { getCloudflareContext } from "@opennextjs/cloudflare";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDb, schema } from "@/db/client";

type BetterAuthInstance = ReturnType<typeof betterAuth>;

type VerificationEmailPayload = {
  user: { email: string; name: string | null };
  url: string;
  token: string;
};

async function sendVerificationEmail(payload: VerificationEmailPayload, env: CloudflareEnv) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    console.warn(
      "[auth] RESEND_API_KEY or RESEND_FROM_EMAIL missing. Deliver the verification link manually:",
      payload.url,
    );
    return;
  }

  const subject = `${env.APP_NAME ?? "Cloudflare Starter"} — Verify your email`;
  const html =
    `<!DOCTYPE html><html><body style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.5;">` +
    `<p>Hi${payload.user.name ? ` ${payload.user.name}` : ""},</p>` +
    `<p>Thanks for creating an account. Click the button below to verify your email address:</p>` +
    `<p><a href="${payload.url}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Verify email</a></p>` +
    `<p>If the button does not work, copy and paste this URL into your browser:</p>` +
    `<p style="word-break:break-all;">${payload.url}</p>` +
    `</body></html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [payload.user.email],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(
      `[auth] Failed to send verification email (${response.status}):`,
      detail || response.statusText,
    );
  }
}

function resolveBaseURL(request: Request, env: CloudflareEnv) {
  if (env.BETTER_AUTH_URL && env.BETTER_AUTH_URL.trim().length > 0) {
    return env.BETTER_AUTH_URL.trim();
  }
  const url = new URL(request.url);
  return url.origin;
}

export async function createAuth(request: Request): Promise<BetterAuthInstance> {
  const { env } = await getCloudflareContext({ async: true });
  const db = createDb(env.D1);
  const auth = betterAuth({
    appName: env.APP_NAME ?? "Cloudflare + Next.js starter",
    baseURL: resolveBaseURL(request, env),
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.users,
        account: schema.accounts,
        session: schema.sessions,
        verification: schema.verifications,
        rateLimit: schema.rateLimits,
      },
      usePlural: true,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      autoSignIn: false,
      minPasswordLength: 8,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async (data) => {
        await sendVerificationEmail(data as VerificationEmailPayload, env);
      },
    },
  });

  return auth;
}

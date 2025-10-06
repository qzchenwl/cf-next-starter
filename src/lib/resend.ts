import { Resend } from "resend";

const DEFAULT_FROM_NAME = "Cloudflare Next Starter";

interface MailRecipient {
  email: string;
  name?: string | null;
}

interface MailContent {
  to: MailRecipient;
  subject: string;
  text: string;
  html: string;
  replyTo?: MailRecipient;
}

function ensureResendApiKey(env: CloudflareEnv): string {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return apiKey;
}

function resolveSender(env: CloudflareEnv): MailRecipient {
  const email = env.RESEND_FROM_EMAIL;

  if (!email) {
    throw new Error("RESEND_FROM_EMAIL is not configured");
  }

  return {
    email,
    name: env.RESEND_FROM_NAME ?? DEFAULT_FROM_NAME,
  };
}

function formatRecipient(recipient: MailRecipient): string {
  const { email, name } = recipient;

  if (!name || !name.trim() || name.trim() === email) {
    return email;
  }

  return `${name.trim()} <${email}>`;
}

async function sendMail(env: CloudflareEnv, message: MailContent) {
  const resend = new Resend(ensureResendApiKey(env));
  const from = resolveSender(env);
  const replyTo = message.replyTo ?? from;

  const { error } = await resend.emails.send({
    from: formatRecipient(from),
    to: [formatRecipient(message.to)],
    subject: message.subject,
    text: message.text,
    html: message.html,
    reply_to: formatRecipient(replyTo),
  });

  if (error) {
    throw new Error(`Resend request failed (${error.name}): ${error.message}`);
  }
}

export async function deliverVerificationEmail(
  env: CloudflareEnv,
  options: { to: MailRecipient; verificationUrl: string },
) {
  const { to, verificationUrl } = options;
  const safeName = to.name?.trim() || to.email;

  const subject = "Verify your email address";
  const text = [
    `Hi ${safeName},`,
    "",
    "Thanks for signing up for Cloudflare Next Starter.",
    "Please confirm your email address by opening the link below:",
    "",
    verificationUrl,
    "",
    "If you did not create this account you can safely ignore this email.",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${subject}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; color: #0f172a;">
    <p>Hi ${safeName},</p>
    <p>Thanks for signing up for <strong>Cloudflare Next Starter</strong>. Please confirm your email address by clicking the button below.</p>
    <p style="margin: 24px 0;">
      <a
        href="${verificationUrl}"
        style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;"
      >Verify email address</a>
    </p>
    <p>If the button above does not work, copy and paste this link into your browser:</p>
    <p><a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a></p>
    <p style="margin-top: 32px;">If you did not create this account you can safely ignore this email.</p>
  </body>
</html>`;

  await sendMail(env, {
    to,
    subject,
    text,
    html,
  });
}

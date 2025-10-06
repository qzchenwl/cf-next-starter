import type { ReactElement } from "react";
import { Resend } from "resend";

import { VerificationEmail } from "@/emails/verification-email";

const DEFAULT_FROM_NAME = "Cloudflare Next Starter";

interface MailRecipient {
  email: string;
  name?: string | null;
}

interface MailContent {
  to: MailRecipient;
  subject: string;
  text?: string;
  html?: string;
  react?: ReactElement;
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
    react: message.react,
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

  await sendMail(env, {
    to,
    subject,
    text,
    react: <VerificationEmail recipientName={safeName} verificationUrl={verificationUrl} />,
  });
}

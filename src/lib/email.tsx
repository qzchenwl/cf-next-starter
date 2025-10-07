import { type User } from 'better-auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { Resend } from 'resend';
import type { CreateEmailOptions, RequireAtLeastOne } from 'resend';
import type { ReactNode } from 'react';
import VerificationEmail from '@/components/verification-email';

interface EmailRenderOptions {
  react: ReactNode;
  html: string;
  text: string;
}

type LooseEmailOptions = RequireAtLeastOne<EmailRenderOptions> &
  Omit<CreateEmailOptions, 'from' | 'react' | 'html' | 'text'>;

async function sendEmail(payload: LooseEmailOptions) {
  const { env } = await getCloudflareContext({ async: true });
  const { RESEND_API_KEY, DEFAULT_EMAIL_FROM_ADDRESS, DEFAULT_EMAIL_FROM_NAME } = env;
  const from = `${DEFAULT_EMAIL_FROM_NAME} <${DEFAULT_EMAIL_FROM_ADDRESS}>`;

  const resend = new Resend(RESEND_API_KEY);
  return await resend.emails.send({ from, ...payload });
}

export async function sendVerificationEmail(
  data: { user: User; url: string; token: string },
  request?: Request, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const { user, url } = data;
  await sendEmail({
    to: user.email,
    subject: 'Verification email',
    react: <VerificationEmail name={user.name} url={url} />,
  });
}

import { type User } from 'better-auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { Resend } from 'resend';
import type { CreateEmailOptions, RequireAtLeastOne } from 'resend';
import type { ReactNode } from 'react';
import LoginCodeEmail from '@/components/login-code-email';
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

export async function sendLoginCodeEmail(
  data: { email: string; otp: string; type: 'sign-in' | 'email-verification' | 'forget-password' },
  request?: Request, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const subjects: Record<typeof data.type, string> = {
    'sign-in': 'Your login code',
    'email-verification': 'Verify your email with a code',
    'forget-password': 'Reset your password code',
  };

  await sendEmail({
    to: data.email,
    subject: subjects[data.type],
    react: <LoginCodeEmail email={data.email} otp={data.otp} type={data.type} />,
  });
}

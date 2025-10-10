import * as React from 'react';
import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind, Text } from '@react-email/components';

export type LoginCodeEmailProps = {
  email: string;
  otp: string;
  type: 'sign-in' | 'email-verification' | 'forget-password';
};

const copy: Record<
  LoginCodeEmailProps['type'],
  {
    preview: string;
    heading: string;
    intro: string;
    instruction: string;
  }
> = {
  'sign-in': {
    preview: 'Your one-time code for signing in',
    heading: 'Use this code to finish signing in',
    intro: 'We received a request to sign in with your email address.',
    instruction: 'Enter the code below in the app. It expires in five minutes.',
  },
  'email-verification': {
    preview: 'Verify your email with this code',
    heading: 'Verify your email address',
    intro: 'Use the code below to confirm your email address.',
    instruction: 'This code expires in five minutes. Enter it where prompted to continue.',
  },
  'forget-password': {
    preview: 'Reset your password with this code',
    heading: 'Reset your password',
    intro: 'We received a request to reset your password.',
    instruction: 'Enter the code below to continue resetting your password. It expires in five minutes.',
  },
};

function formatOtp(otp: string) {
  if (otp.length === 6) {
    return `${otp.slice(0, 3)} ${otp.slice(3)}`;
  }
  return otp;
}

function LoginCodeEmail({ email, otp, type }: LoginCodeEmailProps) {
  const { preview, heading, intro, instruction } = copy[type];
  const formattedOtp = formatOtp(otp);

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#2563eb',
              },
            },
          },
        }}
      >
        <Body className="m-0 bg-slate-100 py-8 font-sans">
          <Container className="mx-auto max-w-[480px] rounded-lg bg-white p-6 shadow-lg">
            <Heading as="h1" className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">
              {heading}
            </Heading>
            <Text className="mb-2 text-base leading-6 text-slate-700">{intro}</Text>
            <Text className="mb-4 text-base leading-6 text-slate-700">
              We&apos;re sending this to <span className="font-semibold text-slate-900">{email}</span>.
            </Text>
            <div className="mb-4 rounded-md bg-slate-100 py-6 text-center">
              <Text className="text-sm uppercase tracking-[0.3em] text-slate-500">One-time code</Text>
              <Text className="mt-2 font-mono text-3xl font-semibold text-slate-900">{formattedOtp}</Text>
            </div>
            <Text className="mb-4 text-base leading-6 text-slate-700">{instruction}</Text>
            <Hr className="my-6 border-slate-200" />
            <Text className="text-sm text-slate-500">
              If you didn&apos;t request this, you can ignore this email. Someone may have typed your address by
              mistake.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default LoginCodeEmail;

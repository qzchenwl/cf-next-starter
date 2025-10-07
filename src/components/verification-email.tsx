import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

export type VerificationEmailProps = {
  url: string;
  name: string;
};

function VerificationEmail({ url, name }: VerificationEmailProps) {
  const greeting = name.trim() ? `Hi ${name},` : 'Hi there,';

  return (
    <Html>
      <Head />
      <Preview>Verify your email address to get started.</Preview>
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
              Confirm your email
            </Heading>
            <Text className="mb-4 text-base leading-6 text-slate-700">{greeting}</Text>
            <Text className="mb-4 text-base leading-6 text-slate-700">
              Thanks for signing up! Please confirm your email address by clicking the button below. The link will
              expire in 24 hours.
            </Text>
            <Section className="mb-6">
              <Button
                href={url}
                className="rounded-md bg-brand px-6 py-3 text-base font-semibold text-white no-underline"
              >
                Verify email address
              </Button>
            </Section>
            <Text className="mb-2 text-base leading-6 text-slate-700">
              If the button does not work, copy and paste this URL into your browser:
            </Text>
            <Text className="break-all rounded-md bg-slate-200 px-3 py-2 font-mono text-sm text-slate-900">{url}</Text>
            <Text className="mt-6 text-base leading-6 text-slate-700">
              If you did not request this email, you can safely ignore it.
            </Text>
            <Text className="text-sm text-slate-500">— The Team</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default VerificationEmail;

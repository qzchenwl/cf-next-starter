import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import VerificationEmail from '@/components/verification-email';

const meta = {
  title: 'Emails/VerificationEmail',
  component: VerificationEmail,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    name: 'Ada Lovelace',
    url: 'https://app.example.com/verify?token=sample-token',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VerificationEmail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutName: Story = {
  args: {
    name: '',
  },
};

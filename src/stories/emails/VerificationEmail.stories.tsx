import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VerificationEmail } from "@/emails/verification-email";

const meta = {
  title: "Emails/VerificationEmail",
  component: VerificationEmail,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    recipientName: "Ada Lovelace",
    verificationUrl: "https://example.com/verify?code=123456",
  },
} satisfies Meta<typeof VerificationEmail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

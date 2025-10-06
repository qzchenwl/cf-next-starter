import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Loader2, Upload } from 'lucide-react';

import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Launch workflow',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary action',
  },
};

export const OutlineWithIcon: Story = {
  args: {
    variant: 'outline',
    children: (
      <span className="flex items-center gap-2">
        Upload asset <Upload className="h-4 w-4" aria-hidden />
      </span>
    ),
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Remove resource',
  },
};

export const LoadingState: Story = {
  args: {
    disabled: true,
    children: (
      <span className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Deploying
      </span>
    ),
  },
};

export const Icon: Story = {
  args: {
    variant: 'ghost',
    size: 'icon',
    'aria-label': 'Continue',
    children: <ArrowRight className="h-4 w-4" aria-hidden />,
  },
};


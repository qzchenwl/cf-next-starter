import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Plus } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Gallery: Story = {
  args: {
    children: "Button",
  },
  parameters: {
    controls: {
      exclude: ["children"],
    },
  },
  render: (args) => {
    const variants = [
      "default",
      "secondary",
      "outline",
      "ghost",
      "destructive",
    ] as const;
    const sizes = ["sm", "default", "lg", "icon"] as const;

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} {...args}>
              {variant === "default"
                ? "Primary"
                : variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Button
              key={size}
              size={size}
              {...args}
              aria-label={size === "icon" ? "Icon button" : undefined}
            >
              {size === "icon" ? (
                <Plus className="h-4 w-4" aria-hidden />
              ) : (
                `${size.charAt(0).toUpperCase()}${size.slice(1)} size`
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

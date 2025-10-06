import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('renders the provided label', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('supports variant and size overrides', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button variant="secondary" size="lg" onClick={onClick}>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('h-11');

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders icon-only buttons with accessible labels', () => {
    render(
      <Button size="icon" aria-label="Add item">
        <span aria-hidden="true">+</span>
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Add item' });

    expect(button).toHaveClass('w-10');
    expect(button).toHaveAttribute('aria-label', 'Add item');
  });
});

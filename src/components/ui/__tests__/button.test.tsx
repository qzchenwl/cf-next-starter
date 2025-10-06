import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../button';

describe('Button', () => {
  it('renders the provided label', () => {
    render(<Button>Trigger action</Button>);

    expect(
      screen.getByRole('button', { name: 'Trigger action' }),
    ).toBeInTheDocument();
  });

  it('invokes the click handler', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant modifiers', () => {
    render(
      <Button variant="destructive" data-testid="danger">
        Delete
      </Button>,
    );

    expect(screen.getByTestId('danger')).toHaveClass('bg-destructive');
  });
});


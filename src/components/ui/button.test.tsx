import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

describe("Button", () => {
  it("renders the provided label", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("supports variant styles and interactions", async () => {
    const onClick = vi.fn();

    render(
      <Button variant="destructive" onClick={onClick}>
        Delete
      </Button>,
    );

    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("bg-destructive");

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

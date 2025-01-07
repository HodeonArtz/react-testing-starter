import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  it("should render the text if its shorter than 255 chars.", () => {
    const text = "short text";

    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
  it("should render the text when expanded.", async () => {
    const text = "a".repeat(256);
    const user = userEvent.setup();

    render(<ExpandableText text={text} />);
    await user.click(screen.getByRole("button"));

    expect(screen.getByText(text)).toBeInTheDocument();
  });
  it("should only render 255 chars with long text.", () => {
    const text = "a".repeat(256);

    render(<ExpandableText text={text} />);

    expect(
      screen.getByText(`${text.substring(0, 255)}...`)
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

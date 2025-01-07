import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);
    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange,
    };
  };
  it("should render an input field for searching", () => {
    const { input } = renderComponent();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, user, onChange } = renderComponent();

    const searchTerm = "SearchTerm";
    await user.type(input, `${searchTerm}{enter}`);

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });
  it("should not call onChange when Enter is pressed with no text", async () => {
    const { input, user, onChange } = renderComponent();

    const searchTerm = "";
    await user.type(input, `${searchTerm}{enter}`);

    expect(onChange).not.toHaveBeenCalled();
  });
});
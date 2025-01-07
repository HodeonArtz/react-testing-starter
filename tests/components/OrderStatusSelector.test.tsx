import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );
    const button = screen.getByRole("combobox");
    const user = userEvent.setup();
    const options = await screen.findAllByRole("option");

    return {
      button,
      user,
      options,
    };
  };

  it("should render New as the default value", async () => {
    const { button } = await renderComponent();

    expect(button).toHaveTextContent(/new/i);
  });
  it("should render correct statuses", async () => {
    const { button, user, options } = await renderComponent();

    await user.click(button);

    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
});

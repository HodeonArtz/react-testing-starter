import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );
    const button = screen.getByRole("combobox");
    const user = userEvent.setup();

    async function getOptions() {
      return await screen.findAllByRole("option");
    }
    async function getOption(value: RegExp) {
      return await screen.findByRole("option", { name: value });
    }

    return {
      button,
      user,
      getOptions,
      getOption,
      onChange,
    };
  };

  it("should render New as the default value", () => {
    const { button } = renderComponent();

    expect(button).toHaveTextContent(/new/i);
  });
  it("should render correct statuses", async () => {
    const { button, user, getOptions } = renderComponent();

    await user.click(button);

    const options = await getOptions();

    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])("should render with $label value", async ({ label, value }) => {
    const { button, user, onChange } = renderComponent();
    await user.click(button);

    const option = await screen.findByRole("option", { name: label });
    await user.click(option);
    expect(onChange).toHaveBeenCalledWith(value);
  });
  it("should render with new value", async () => {
    const { button, user, onChange } = renderComponent();
    const label = /new/i;
    const value = "new";
    await user.click(button);
    const processedOption = await screen.findByRole("option", {
      name: /processed/i,
    });
    await user.click(processedOption);

    await user.click(button);
    const option = await screen.findByRole("option", { name: label });
    await user.click(option);
    expect(onChange).toHaveBeenCalledWith(value);
  });
});

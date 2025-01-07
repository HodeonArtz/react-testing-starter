import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import { Toaster } from "react-hot-toast";
import userEvent from "@testing-library/user-event";

describe("ToastDemo", () => {
  it("should render Toaster when clicking button", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const user = userEvent.setup();
    const button = screen.getByRole("button");
    user.click(button);

    const toaster = await screen.findByText(/success/i);

    expect(toaster).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";
import { User } from "@auth0/auth0-react";
describe("AuthStatus", () => {
  const renderComponent = () => {
    render(<AuthStatus />);
  };
  it("should render loading component", async () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: true,
      user: undefined,
    });
    renderComponent();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
  it("should render logout and name component when authenticated", async () => {
    const user = { name: "Marti" };
    mockAuthState({
      isAuthenticated: true,
      isLoading: false,
      user,
    });
    renderComponent();

    expect(await screen.findByText(user.name)).toBeInTheDocument();
    expect(await screen.findByText(/log out/i)).toBeInTheDocument();
    expect(await screen.queryByText(/log in/i)).not.toBeInTheDocument();
  });
  it("should render a login button when unauthenticated", async () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });
    renderComponent();
    expect(await screen.queryByText(/log out/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/log in/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should appear user's name with provided User", () => {
    const user: User = { id: 1, name: "Glen" };
    render(<UserAccount user={user} />);
    const userName = screen.getByText(user.name);

    expect(userName).toBeInTheDocument();
  });

  it("should appear edit button when provided user is admin", () => {
    const user: User = { id: 1, name: "Glen", isAdmin: true };
    render(<UserAccount user={user} />);

    const editButton = screen.queryByRole("button");
    expect(editButton).toBeInTheDocument();
  });
  it("should not appear edit button when provided user is not admin", () => {
    const user: User = { id: 1, name: "Glen" };
    render(<UserAccount user={user} />);

    const editButton = screen.queryByRole("button");
    expect(editButton).not.toBeInTheDocument();
  });
});

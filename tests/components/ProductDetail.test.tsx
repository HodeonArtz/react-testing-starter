import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

describe("group", () => {
  it("should render a product with provided id", async () => {
    const id = 1;
    render(<ProductDetail productId={id} />);

    const product = await screen.findByText(/product detail/i);

    expect(product).toBeInTheDocument();
  });

  it("should render nothing if provided product is not found", async () => {
    server.use(
      http.get("/products/:id", () => {
        return HttpResponse.json(null);
      })
    );

    const id = 1;
    render(<ProductDetail productId={id} />);

    const product = await screen.findByText(/not found/i);
    expect(product).toBeInTheDocument();
  });
});

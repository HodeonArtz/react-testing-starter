import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { AllProviders } from "../AllProviders";

describe("group", () => {
  it.skip("should render a product with provided id", async () => {
    const id = 1;
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });

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
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });

    const product = await screen.findByText(/not found/i);
    expect(product).toBeInTheDocument();
  });

  it("should give an error message when fetch has error", async () => {
    server.use(
      http.get("/products/:id", () => {
        return HttpResponse.error();
      })
    );

    const id = 1;
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });
    const product = await screen.findByText(/error/i);
    expect(product).toBeInTheDocument();
  });

  it("should have a loading screen when fetching data", async () => {
    server.use(
      http.get("/products/:id", () => {
        delay(500);
        return HttpResponse.json(null);
      })
    );
    const id = 1;
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
  it("should remove loading screen when finishing fetching data", async () => {
    server.use(
      http.get("/products/:id", () => {
        delay(500);
        return HttpResponse.json(null);
      })
    );
    const id = 1;
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});

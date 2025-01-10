import { render, screen } from "@testing-library/react";
import { CartProvider } from "../../src/providers/CartProvider";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Milk",
      price: 5,
      categoryId: 1,
    };
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const getQuantityControls = () => ({
      quantity: screen.queryByRole("status"),
      decrementButton: screen.queryByRole("button", { name: "-" }),
      incrementButton: screen.queryByRole("button", { name: "+" }),
    });
    const getAddToCartButton = () =>
      screen.getByRole("button", { name: /add to cart/i });

    const user = userEvent.setup();

    const addToCart = async () => {
      const button = getAddToCartButton();
      await user.click(button!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };
    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };

    return {
      getAddToCartButton,
      addToCartButton: getAddToCartButton(),
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it("should render the Add to Cart button", () => {
    const { addToCartButton } = renderComponent();
    expect(addToCartButton).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { addToCartButton, addToCart, getQuantityControls } =
      renderComponent();
    await addToCart();

    const { decrementButton, incrementButton, quantity } =
      getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(addToCartButton).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { incrementQuantity, addToCart, getQuantityControls } =
      renderComponent();
    await addToCart();

    await incrementQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("2");
  });
  it("should decrement the quantity", async () => {
    const {
      addToCart,
      incrementQuantity,
      decrementQuantity,
      getQuantityControls,
    } = renderComponent();
    await addToCart();
    const { quantity } = getQuantityControls();

    await incrementQuantity();
    await decrementQuantity();

    expect(quantity).toHaveTextContent("1");
  });
  it("should remove product from cart", async () => {
    const {
      addToCart,
      decrementQuantity,
      getAddToCartButton,
      getQuantityControls,
    } = renderComponent();
    await addToCart();
    const { incrementButton, decrementButton, quantity } =
      getQuantityControls();

    await decrementQuantity();

    expect(quantity).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import { AllProviders } from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(
      <AllProviders>
        <ProductForm product={product} onSubmit={vi.fn()} />
      </AllProviders>
    );

    const waitForFormToLoad = async () => {
      await screen.findByRole("form");
      return {
        nameField: screen.getByPlaceholderText(/name/i),
        priceField: screen.getByPlaceholderText(/price/i),
        comboBoxField: screen.getByRole("combobox", { name: /category/i }),
        submitButton: screen.getByRole("button"),
      };
    };

    return {
      waitForFormToLoad,
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { nameField, priceField, comboBoxField } = await waitForFormToLoad();

    expect(nameField).toBeInTheDocument();
    expect(priceField).toBeInTheDocument();
    expect(comboBoxField).toBeInTheDocument();
  });

  it("should populate form fields when editing a product ", async () => {
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 10,
      categoryId: category.id,
    };
    const { waitForFormToLoad } = renderComponent(product);
    const { nameField, priceField, comboBoxField } = await waitForFormToLoad();

    expect(nameField).toHaveValue(product.name);
    expect(priceField).toHaveValue(product.price.toString());
    expect(comboBoxField).toHaveTextContent(category.name);
  });

  it("should focus name input", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameField } = await waitForFormToLoad();

    expect(nameField).toHaveFocus();
  });

  it("should display an error if name is missing", async () => {
    const { waitForFormToLoad } = renderComponent();
    const form = await waitForFormToLoad();
    const user = userEvent.setup();
    await user.type(form.priceField, "10");
    await user.click(form.comboBoxField);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(form.submitButton);

    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i);
  });
});

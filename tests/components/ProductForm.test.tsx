import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { AllProviders } from "../AllProviders";
import { Category, Product } from "../../src/entities";
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
      await waitForElementToBeRemoved(() => screen.queryAllByText(/loading/i));
    };

    const getInputs = () => {
      return {
        nameField: screen.getByPlaceholderText(/name/i),
        priceField: screen.getByPlaceholderText(/price/i),
        comboBoxField: screen.getByRole("combobox", { name: /category/i }),
      };
    };

    return {
      waitForFormToLoad,
      getInputs,
    };
  };

  it("should render form fields", async () => {
    const { getInputs, waitForFormToLoad } = renderComponent();
    await waitForFormToLoad();
    const inputs = getInputs();

    expect(inputs.nameField).toBeInTheDocument();
    expect(inputs.priceField).toBeInTheDocument();
    expect(inputs.comboBoxField).toBeInTheDocument();
  });

  it("should populate form fields when editing a product ", async () => {
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 10,
      categoryId: category.id,
    };
    const { getInputs, waitForFormToLoad } = renderComponent(product);

    await waitForFormToLoad();
    const inputs = getInputs();

    expect(inputs.nameField).toHaveValue(product.name);
    expect(inputs.priceField).toHaveValue(product.price.toString());
    expect(inputs.comboBoxField).toHaveTextContent(category.name);
  });

  it("should focus name input", async () => {
    const { getInputs, waitForFormToLoad } = renderComponent();
    await waitForFormToLoad();
    const inputs = getInputs();
    expect(inputs.nameField).toHaveFocus();
  });
});

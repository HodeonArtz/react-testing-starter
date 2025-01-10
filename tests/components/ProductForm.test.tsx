import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
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
    const onSubmit = vi.fn();

    render(
      <AllProviders>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </AllProviders>
    );

    const waitForFormToLoad = async () => {
      await screen.findByRole("form");

      const nameField = screen.getByPlaceholderText(/name/i),
        priceField = screen.getByPlaceholderText(/price/i),
        comboBoxField = screen.getByRole("combobox", { name: /category/i }),
        submitButton = screen.getByRole("button");

      type FormData = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [K in keyof Product]: any;
      };

      const validData: FormData = {
        id: 1,
        name: "aaaa",
        price: 1,
        categoryId: category.id,
      };

      const fill = async (product: FormData) => {
        const user = userEvent.setup();

        if (product.name !== undefined)
          await user.type(nameField, product.name);

        if (product.price !== undefined)
          await user.type(priceField, product.price + "");

        await user.tab();
        await user.click(comboBoxField);
        const options = screen.getAllByRole("option");
        await user.click(options[0]);
        await user.click(submitButton);
      };

      return {
        nameField,
        priceField,
        comboBoxField,
        submitButton,
        fill,
        validData,
      };
    };

    return {
      waitForFormToLoad,
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },
      onSubmit,
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

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "less than 1",
      price: 0,
      errorMessage: /1/,
    },
    {
      scenario: "more than 1000",
      price: 1001,
      errorMessage: /1000/,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );
  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "missing",
      name: " ",
      errorMessage: /invalid/i,
    },
    {
      scenario: "longer than 255",
      name: "a".repeat(256),
      errorMessage: /255/,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it("should call onSubmit with the correct data", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...formData } = form.validData;
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });
  it("should show toast message on submit error", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});
    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it("should disable button when submitting", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {}));
    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    expect(form.submitButton).toBeDisabled();
  });
});

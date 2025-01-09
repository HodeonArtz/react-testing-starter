import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";
describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "Category " + item });
      categories.push(category);
      [1, 2, 3].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });
  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    const productsIds = products.map((product) => product.id);
    db.category.deleteMany({ where: { id: { in: productsIds } } });
  });

  it.todo("should show a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");
    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");
    const { getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesComboBox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox: HTMLElement = getCategoriesComboBox();
    console.log(combobox);
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    categories.forEach((category) => {
      expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: category.name }))
        .toBeInTheDocument;
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter products by categor", async () => {
    const { selectCategory, expectProductsToBeInTheDocuments } =
      renderComponent();

    const selectedCategory = categories[0];
    selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocuments(products);
  });

  it("should render all products from all categories", async () => {
    const { selectCategory, expectProductsToBeInTheDocuments } =
      renderComponent();

    selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocuments(products);
  });
});

const renderComponent = () => {
  render(
    <CartProvider>
      <Theme>
        <BrowseProducts />
      </Theme>
    </CartProvider>
  );
  const getCategoriesSkeleton = () =>
    screen.queryByRole("progressbar", { name: /categories/i });

  const getCategoriesComboBox = () => screen.queryByRole("combobox")!;

  const getProductsSkeleton = () =>
    screen.queryByRole("progressbar", { name: /products/i });

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton());
    const combobox = getCategoriesComboBox();
    const user = userEvent.setup();
    await user.click(combobox);

    const option = screen.getByRole("option", { name });
    await user.click(option);
  };

  const expectProductsToBeInTheDocuments = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getProductsSkeleton,
    getCategoriesSkeleton,
    getCategoriesComboBox,
    selectCategory,
    expectProductsToBeInTheDocuments,
  };
};

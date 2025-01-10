import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";
describe("Label", () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  it.each([
    { labelId: "welcome", text: "Welcome" },
    { labelId: "new_product", text: "New Product" },
    { labelId: "edit_product", text: "Edit Product" },
  ])("should render $text for $labelId", ({ labelId, text }) => {
    renderComponent(labelId, "en");

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it.each([
    { labelId: "welcome", text: "Bienvenidos" },
    { labelId: "new_product", text: "Nuevo Producto" },
    { labelId: "edit_product", text: "Editar Producto" },
  ])("should render $text for $labelId in ES", ({ labelId, text }) => {
    renderComponent(labelId, "es");

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should throw exception when label id is invalid", () => {
    expect(() => renderComponent("!", "en")).toThrowError();
  });
});

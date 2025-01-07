import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should render nothing when empty array is provided", () => {
    expect(
      render(<ProductImageGallery imageUrls={[]} />).container
    ).toBeEmptyDOMElement();
  });
  it("should render a list of images", () => {
    const imageUrls: string[] = ["image1.png", "image2.png", "image3.png"];
    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole("img");
    imageUrls.forEach((imageUrl, index) => {
      expect(images[index]).toHaveAttribute("src", imageUrl);
    });
  });
});

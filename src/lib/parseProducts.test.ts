import { describe, it, expect } from "vitest";
import { parseProductList } from "./parseProducts";

describe("parseProductList", () => {
  it("parses a product with price and unit (x format)", () => {
    const { products, errors } = parseProductList(
      "-Langostinos desvenados $3500 x 100 grs"
    );

    expect(errors).toHaveLength(0);
    expect(products).toHaveLength(1);
    expect(products[0].title).toBe("Langostinos desvenados");
    expect(products[0].price).toBe(3500);
    expect(products[0].unit).toBe("100 grs");
  });

  it("parses a product where the name contains 'x <unit>' and price has no unit", () => {
    const { products, errors } = parseProductList(
      "-ACONDICIONADOR NATURAL -FORMULA CABELLOS SECOS BEL LAB x 500ml $12100"
    );

    expect(errors).toHaveLength(0);
    expect(products).toHaveLength(1);
    expect(products[0].title).toBe(
      "ACONDICIONADOR NATURAL -FORMULA CABELLOS SECOS BEL LAB x 500ml"
    );
    expect(products[0].price).toBe(12100);
    expect(products[0].unit).toBe("");
  });
});

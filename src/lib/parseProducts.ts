import { v4 as uuidv4 } from "uuid";

export interface ParsedProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
}

// Matches lines like:
//   _Langostinos desvenados $3500 x 100 grs
//   _Mix de mariscos $35000 kg
//   Mejillón pelado $2300 x 100grs.
const PRODUCT_REGEX =
  /^[_\-\*\•]?\s*(.+?)\s*\$\s*([\d.,]+)\s*(?:x\s*)?([^$\n]+?)\s*\.?\s*$/;

function parsePrice(raw: string): number {
  // Argentine peso: $3.500 means 3500 (dot as thousands separator)
  // Strip all . and , then parse as integer
  return parseInt(raw.replace(/[.,]/g, ""), 10);
}

export function parseProductList(text: string): {
  products: ParsedProduct[];
  errors: Array<{ line: string; reason: string }>;
} {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const products: ParsedProduct[] = [];
  const errors: Array<{ line: string; reason: string }> = [];

  for (const line of lines) {
    const match = PRODUCT_REGEX.exec(line);
    if (!match) {
      errors.push({ line, reason: "No se pudo interpretar la línea" });
      continue;
    }

    const [, title, priceRaw, unit] = match;
    const price = parsePrice(priceRaw);

    if (isNaN(price) || price <= 0) {
      errors.push({ line, reason: "Precio inválido" });
      continue;
    }

    if (!title.trim()) {
      errors.push({ line, reason: "Falta el nombre del producto" });
      continue;
    }

    products.push({
      id: uuidv4(),
      title: title.trim(),
      price,
      unit: unit.trim(),
    });
  }

  return { products, errors };
}

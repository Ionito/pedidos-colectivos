"use client";

import { useState, useEffect, useCallback } from "react";
import { parseProductList, ParsedProduct } from "@/lib/parseProducts";
import { formatCurrency } from "@/lib/formatters";

interface Props {
  onProductsParsed: (products: ParsedProduct[]) => void;
}

export function ProductParserInput({ onProductsParsed }: Props) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<ReturnType<
    typeof parseProductList
  > | null>(null);

  const handleChange = useCallback(
    (value: string) => {
      setText(value);
      if (!value.trim()) {
        setParsed(null);
        onProductsParsed([]);
        return;
      }
      const result = parseProductList(value);
      setParsed(result);
      onProductsParsed(result.products);
    },
    [onProductsParsed]
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lista de productos
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Pegá el texto con los productos. Formato: Nombre $precio x unidad
        </p>
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={
            "_Langostinos desvenados $3500 x 100 grs\n_Camarones pre-cocidos $3800 x 100 grs\n_Mix de mariscos $35000 kg"
          }
          className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={7}
        />
      </div>

      {parsed && (parsed.products.length > 0 || parsed.errors.length > 0) && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Vista previa ({parsed.products.length} productos
            {parsed.errors.length > 0 && `, ${parsed.errors.length} errores`})
          </p>

          {parsed.products.map((p) => (
            <div
              key={p.id}
              className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex justify-between items-center"
            >
              <span className="text-sm font-medium text-gray-800">
                {p.title}
              </span>
              <span className="text-sm text-gray-500 shrink-0 ml-2">
                {formatCurrency(p.price)} / {p.unit}
              </span>
            </div>
          ))}

          {parsed.errors.map((e, i) => (
            <div
              key={i}
              className="bg-red-50 border border-red-200 rounded-xl px-3 py-2"
            >
              <p className="text-xs font-mono text-red-600 truncate">{e.line}</p>
              <p className="text-xs text-red-400 mt-0.5">{e.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

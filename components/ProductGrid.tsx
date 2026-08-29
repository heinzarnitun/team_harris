"use client";

import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { filterProducts, useApp } from "./AppProvider";

export default function ProductGrid() {
  const { products, selectedCategory, aiVerifiedOnly, barterOnly, searchQuery } = useApp();
  const filtered = useMemo(
    () =>
      filterProducts(products, {
        category: selectedCategory,
        aiVerifiedOnly,
        barterOnly,
        query: searchQuery,
      }),
    [products, selectedCategory, aiVerifiedOnly, barterOnly, searchQuery],
  );

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center text-slate-500">
        No listings match those AI filters yet. Try widening your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

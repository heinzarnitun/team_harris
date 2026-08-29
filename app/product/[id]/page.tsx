"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ProductDetail from "@/components/ProductDetail";
import { useApp } from "@/components/AppProvider";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const { products } = useApp();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Listing not found</h1>
        <p className="mt-2 text-sm text-slate-500">It may have been swapped, sold, or given away.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
          Back to feed
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import DiscoveryFilters from "@/components/DiscoveryFilters";
import ProductGrid from "@/components/ProductGrid";
import { useApp } from "@/components/AppProvider";

function SearchInner() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const { setSearchQuery, searchQuery } = useApp();

  useEffect(() => {
    if (q && q !== searchQuery) setSearchQuery(q);
  }, [q, searchQuery, setSearchQuery]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI search</h1>
        <p className="mt-1 break-words text-sm text-slate-500">
          Showing local matches for{" "}
          <span className="font-medium text-slate-700">
            {searchQuery || "everything nearby"}
          </span>
        </p>
      </div>
      <DiscoveryFilters />
      <ProductGrid />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading search…</div>}>
      <SearchInner />
    </Suspense>
  );
}

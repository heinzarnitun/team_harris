"use client";

import DiscoveryFilters from "@/components/DiscoveryFilters";
import ProductGrid from "@/components/ProductGrid";
import { t } from "@/lib/i18n";
import { useApp } from "@/components/AppProvider";

export default function HomePage() {
  const { lang } = useApp();
  const copy = t[lang];
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <section className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 p-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">{copy.heroKicker}</p>
        <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-snug sm:text-3xl">{copy.hero}</h1>
        <p className="mt-2 max-w-xl break-words text-sm text-emerald-100">{copy.heroMyHint}</p>
      </section>
      <DiscoveryFilters />
      <ProductGrid />
    </div>
  );
}

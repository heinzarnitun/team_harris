"use client";

import { MOCK_CATEGORIES } from "@/lib/mockData";
import { t } from "@/lib/i18n";
import type { CategoryName } from "@/lib/types";
import { useApp } from "./AppProvider";

export default function DiscoveryFilters() {
  const {
    selectedCategory,
    setSelectedCategory,
    aiVerifiedOnly,
    setAiVerifiedOnly,
    barterOnly,
    setBarterOnly,
    lang,
  } = useApp();
  const copy = t[lang];

  return (
    <div className="space-y-3">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {MOCK_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat as CategoryName)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={aiVerifiedOnly}
            onChange={(e) => setAiVerifiedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
          />
          {copy.aiVerifiedOnly}
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={barterOnly}
            onChange={(e) => setBarterOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
          />
          {copy.barterOnly}
        </label>
      </div>
    </div>
  );
}

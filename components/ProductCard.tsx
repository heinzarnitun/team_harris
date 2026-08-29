"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { formatKs } from "@/lib/money";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.aiVerified && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md sm:text-xs">
            ✨ AI Verified
          </span>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 backdrop-blur-md sm:text-xs">
          🌱 -{product.co2SavedKg}kg CO₂
        </span>
        {product.barterAvailable && (
          <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            🔄 Swap OK
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-900 break-words">
          {product.title}
        </h3>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-bold text-emerald-700">{formatKs(product.price)}</span>
          <span className="text-xs text-slate-400 line-through">{formatKs(product.originalPrice)}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {product.distance}
          </span>
        </div>
        <div className="mt-auto space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>
              {product.aiConditionScore}% {product.aiConditionLabel}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${product.aiConditionScore}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {product.seller.name} · {product.seller.trustScore}% trust
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

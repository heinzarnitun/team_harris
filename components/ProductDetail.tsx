"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, MessageCircle, RefreshCw } from "lucide-react";
import type { Product, ProductDefect } from "@/lib/types";
import { t } from "@/lib/i18n";
import { useApp } from "./AppProvider";

function severityColor(severity: ProductDefect["severity"]) {
  if (severity === "major") return "bg-rose-500";
  if (severity === "moderate") return "bg-amber-500";
  return "bg-emerald-400";
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { user, requireAuth, openChatWithSeller, lang } = useApp();
  const copy = t[lang];
  const [activeDefect, setActiveDefect] = useState<ProductDefect | null>(null);
  const [notice, setNotice] = useState("");
  const delta = Math.round(((product.marketAverage - product.price) / Math.max(1, product.marketAverage)) * 100);
  const below = delta > 0;
  const priceRatio = Math.min(100, Math.round((product.price / Math.max(1, product.marketAverage)) * 100));

  const goChat = async () => {
    if (!requireAuth()) return;
    if (user && product.userId === user.id) {
      setNotice(copy.ownListing);
      return;
    }
    try {
      const id = await openChatWithSeller(product);
      if (id) router.push(`/chat?c=${id}`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : copy.loginToChat);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-4">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[4/3] bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
            {product.defects.map((d) => (
              <button
                key={`${d.x}-${d.y}-${d.label}`}
                type="button"
                onClick={() => setActiveDefect(activeDefect?.label === d.label ? null : d)}
                className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                aria-label={d.label}
              >
                <span className={`defect-pulse block h-6 w-6 rounded-full ${severityColor(d.severity)} ring-4 ring-white/80`} />
              </button>
            ))}
            {activeDefect && (
              <div
                className="absolute z-10 max-w-[220px] rounded-2xl border border-slate-200 bg-white p-3 text-left text-xs shadow-lg"
                style={{
                  left: `${Math.min(68, Math.max(8, activeDefect.x))}%`,
                  top: `${Math.min(72, activeDefect.y + 8)}%`,
                }}
              >
                <p className="font-semibold text-emerald-700">AI Detection</p>
                <p className="mt-1 break-words leading-relaxed text-slate-700">
                  {activeDefect.label} ({activeDefect.severity})
                </p>
              </div>
            )}
          </div>
          <p className="px-4 py-3 text-xs text-slate-500">
            Tap a pulse dot to inspect AI-detected wear. {product.defects.length} hotspot
            {product.defects.length === 1 ? "" : "s"} found.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{product.category}</p>
            <h1 className="mt-1 break-words text-2xl font-bold text-slate-900">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700">${product.price}</span>
              <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {product.distance} · {product.location}
              </span>
            </div>
            <p className="mt-4 break-words text-sm leading-relaxed text-slate-600">{product.description}</p>
            <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">{product.descriptionMy}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Price analytics</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${priceRatio}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {below
                ? `Priced ${delta}% below local market value (avg $${product.marketAverage})`
                : `Asking is ${Math.abs(delta)}% above local average ($${product.marketAverage})`}
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 p-5 text-white shadow-sm">
            <p className="text-sm font-medium">
              Buying this item prevents {product.eWastePreventedKg} kg of e-waste from landfills.
            </p>
            <p className="mt-1 text-xs text-emerald-100">Also avoids {product.co2SavedKg} kg CO₂ versus buying new.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="flex items-center gap-1 font-semibold text-slate-900">
                  {product.seller.name}
                  {product.seller.verified && <BadgeCheck className="h-4 w-4 text-emerald-600" />}
                </p>
                <p className="text-xs text-slate-500">Responds {product.seller.responseRate}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              🟢 {product.seller.trustScore}% Safe Seller Score
              {product.seller.verified ? " — Verified Local Identity" : " — Identity pending"}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${product.seller.trustScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:bottom-0">
        <div className="mx-auto flex max-w-5xl flex-col gap-2">
          {notice && <p className="text-center text-xs text-amber-700">{notice}</p>}
          <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void goChat()}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            {copy.negotiate}
          </button>
          <button
            type="button"
            onClick={() => void goChat()}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            <RefreshCw className="h-4 w-4" />
            {copy.swap}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

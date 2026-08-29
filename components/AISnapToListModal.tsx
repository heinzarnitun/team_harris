"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Upload, X } from "lucide-react";
import { AI_SCAN_STEPS } from "@/lib/mockData";
import type { Product, TradingMode } from "@/lib/types";
import { useApp } from "./AppProvider";

const EN_DESC =
  "Compact oak side table in excellent condition. Solid wood grain, stable legs, and a warm honey finish. Ideal for apartments. AI estimates strong local demand this week.";
const MY_DESC =
  "အခြေအနေကောင်းမွန်သော ကျစ်လစ်သစ်သားဘေးစားပွဲ။ သစ်သားအသားလှပပြီး ခြေထောက်များ တည်ငြိမ်သည်။ တိုက်ခန်းများအတွက် သင့်တော်သည်။";

type Phase = "idle" | "scanning" | "form" | "published";

export default function AISnapToListModal() {
  const { sellModalOpen, setSellModalOpen, addProduct } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [title, setTitle] = useState("Compact Oak Side Table");
  const [category, setCategory] = useState("🔄 Barter/Swap");
  const [lang, setLang] = useState<"en" | "my">("en");
  const [price, setPrice] = useState(24);
  const [mode, setMode] = useState<TradingMode>("direct");
  const [dragOver, setDragOver] = useState(false);

  const close = () => {
    setSellModalOpen(false);
    setPhase("idle");
    setPreview(null);
    setScanStep(0);
    setTitle("Compact Oak Side Table");
    setCategory("🔄 Barter/Swap");
    setLang("en");
    setPrice(24);
    setMode("direct");
  };

  useEffect(() => {
    if (phase !== "scanning") return;
    const t1 = window.setTimeout(() => setScanStep(1), 900);
    const t2 = window.setTimeout(() => setScanStep(2), 1800);
    const t3 = window.setTimeout(() => setPhase("form"), 2800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [phase]);

  if (!sellModalOpen) return null;

  const onFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanStep(0);
    setPhase("scanning");
  };

  const publish = () => {
    const product: Product = {
      id: `p-${Date.now()}`,
      title,
      price: mode === "giveaway" ? 0 : price,
      originalPrice: 48,
      marketAverage: 24,
      category: category as Product["category"],
      image:
        preview ||
        "https://images.unsplash.com/photo-1533090488595-6b2d85d3ba34?auto=format&fit=crop&w=1200&q=80",
      distance: "0.2 km away",
      location: "Downtown",
      aiConditionScore: 91,
      aiConditionLabel: "Like New",
      co2SavedKg: 5.1,
      eWastePreventedKg: 2.4,
      defects: [
        { x: 40, y: 48, label: "Light wear on table edge", severity: "minor" },
      ],
      seller: {
        name: "Alex Rivera",
        avatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
        trustScore: 96,
        verified: true,
        responseRate: "< 15 mins",
      },
      aiVerified: true,
      barterAvailable: mode !== "direct",
      description: EN_DESC,
      descriptionMy: MY_DESC,
    };
    addProduct(product);
    setPhase("published");
    window.setTimeout(() => close(), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-xl sm:rounded-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              AI Snap-to-List
            </p>
            <h2 className="text-lg font-semibold text-slate-900">List a circular find</h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {phase === "idle" && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) onFile(file);
              }}
              className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
                dragOver
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-slate-50 hover:border-emerald-400"
              }`}
            >
              <Upload className="mb-3 h-8 w-8 text-emerald-600" />
              <p className="font-semibold text-slate-800">Drop a photo or tap to upload</p>
              <p className="mt-1 text-sm text-slate-500">
                AI Vision will inspect condition, brand, and fair price
              </p>
            </button>
          )}

          {phase !== "idle" && preview && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
              {phase === "scanning" && (
                <div className="absolute inset-0 flex flex-col justify-end bg-slate-900/70 p-4 text-white">
                  <p className="text-sm font-medium">
                    ✨ AI Vision inspecting item condition, brand, and market price...
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs">
                    {AI_SCAN_STEPS.map((step, i) => (
                      <li
                        key={step}
                        className={i <= scanStep ? "text-emerald-200" : "text-white/40"}
                      >
                        {i < scanStep ? "✓" : i === scanStep ? "●" : "○"} {step}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                      style={{ width: `${((scanStep + 1) / AI_SCAN_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === "form" && (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option>⚡ Electronics</option>
                  <option>👗 Fashion</option>
                  <option>📚 Books</option>
                  <option>🔄 Barter/Swap</option>
                  <option>🌱 Eco-Deals</option>
                </select>
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">AI generated description</p>
                  <div className="flex rounded-full border border-slate-200 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setLang("en")}
                      className={`rounded-full px-2.5 py-1 ${lang === "en" ? "bg-emerald-600 text-white" : "text-slate-600"}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("my")}
                      className={`rounded-full px-2.5 py-1 ${lang === "my" ? "bg-emerald-600 text-white" : "text-slate-600"}`}
                    >
                      မြန်မာ
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {lang === "en" ? EN_DESC : MY_DESC}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  AI fair price range · ${price}
                </p>
                <input
                  type="range"
                  min={20}
                  max={28}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                  <span>$20 Fast Sale</span>
                  <span>$24 Fair Value</span>
                  <span>$28 High Value</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Trading mode</p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["direct", "Direct Sale"],
                      ["barter", "Barter/Swap"],
                      ["giveaway", "Free Giveaway"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMode(key)}
                      className={`rounded-xl border px-2 py-2 text-xs font-medium ${
                        mode === key
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={publish}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                <Sparkles className="h-4 w-4" />
                Publish Listing
              </button>
            </>
          )}

          {phase === "published" && (
            <div className="rounded-2xl bg-emerald-50 px-4 py-8 text-center text-emerald-800">
              <p className="text-lg font-semibold">✨ Listing live in your neighborhood</p>
              <p className="mt-1 text-sm">It now appears at the top of the discovery feed.</p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </div>
    </div>
  );
}

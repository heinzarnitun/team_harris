"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Upload, X } from "lucide-react";
import { AI_SCAN_STEPS } from "@/lib/mockData";
import { t } from "@/lib/i18n";
import { formatKs } from "@/lib/money";
import { fileToJpegDataUrl, inspectListingPhoto, type VisionHit } from "@/lib/aiVision";
import type { TradingMode } from "@/lib/types";
import { useApp } from "./AppProvider";

type Phase = "idle" | "scanning" | "denied" | "form" | "published";

export default function AISnapToListModal() {
  const { sellModalOpen, setSellModalOpen, addProduct, lang: uiLang } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const extraRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [scanStep, setScanStep] = useState(0);
  const [vision, setVision] = useState<VisionHit | null>(null);
  const [deny, setDeny] = useState<{ en: string; my: string } | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("⚡ Electronics");
  const [descEn, setDescEn] = useState("");
  const [descMy, setDescMy] = useState("");
  const [descLang, setDescLang] = useState<"en" | "my">("en");
  const [price, setPrice] = useState(86400);
  const [priceMin, setPriceMin] = useState(72000);
  const [priceMax, setPriceMax] = useState(180000);
  const [mode, setMode] = useState<TradingMode>("direct");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setPhase("idle");
    setPreview(null);
    setHeroData(null);
    setGallery([]);
    setScanStep(0);
    setVision(null);
    setDeny(null);
    setTitle("");
    setCategory("⚡ Electronics");
    setDescEn("");
    setDescMy("");
    setDescLang("en");
    setPrice(86400);
    setMode("direct");
    setError("");
  };

  const close = () => {
    setSellModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (phase !== "scanning") return;
    const t1 = window.setTimeout(() => setScanStep(1), 700);
    const t2 = window.setTimeout(() => setScanStep(2), 1400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase]);

  if (!sellModalOpen) return null;

  const onFile = async (file: File) => {
    setError("");
    setDeny(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanStep(0);
    setPhase("scanning");
    const result = await inspectListingPhoto(file);
    window.setTimeout(async () => {
      if (!result.ok) {
        setDeny({ en: result.reason, my: result.reasonMy });
        setPhase("denied");
        return;
      }
      let data: string | null = null;
      try {
        data = await fileToJpegDataUrl(file);
      } catch {
        data = result.heroUrl;
      }
      setHeroData(data);
      setVision(result);
      setTitle(result.title);
      setCategory(result.category);
      setDescEn(result.description);
      setDescMy(result.descriptionMy);
      setPrice(result.price);
      setPriceMin(result.priceMin);
      setPriceMax(result.priceMax);
      setMode(result.tradingMode);
      setPhase("form");
    }, 2200);
  };

  const addExtras = async (files: FileList | null) => {
    if (!files?.length) return;
    const next: string[] = [];
    for (const file of Array.from(files).slice(0, 6)) {
      try {
        next.push(await fileToJpegDataUrl(file, 900));
      } catch {
        /* skip */
      }
    }
    setGallery((g) => [...g, ...next].slice(0, 8));
  };

  const publish = async () => {
    if (!vision) return;
    setError("");
    try {
      const imageUrl = heroData || vision.heroUrl;
      await addProduct({
        title,
        price: mode === "giveaway" ? 0 : price,
        originalPrice: priceMax,
        category,
        imageUrl,
        distance: "0.2 km away",
        location: "Downtown Yangon",
        aiConditionScore: vision.conditionScore,
        aiConditionLabel: vision.conditionLabel,
        co2SavedKg: vision.co2SavedKg,
        defects: [{ x: 42, y: 48, label: "AI-noted light wear on visible surface", severity: "minor" }],
        tradingMode: mode,
        description: descEn,
        descriptionMy: descMy,
        gallery,
      });
      setPhase("published");
      window.setTimeout(() => close(), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-xl sm:rounded-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">AI Snap-to-List</p>
            <h2 className="text-lg font-semibold text-slate-900">List a circular find</h2>
          </div>
          <button type="button" onClick={close} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
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
                if (file) void onFile(file);
              }}
              className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
                dragOver ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-emerald-400"
              }`}
            >
              <Upload className="mb-3 h-8 w-8 text-emerald-600" />
              <p className="font-semibold text-slate-800">Drop one hero photo of the item</p>
              <p className="mt-1 text-sm text-slate-500">
                AI Vision identifies the object, fair Ks range, and blocks living things / weird shots. Extra detail photos come next.
              </p>
            </button>
          )}

          {phase !== "idle" && preview && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
              {phase === "scanning" && (
                <div className="absolute inset-0 flex flex-col justify-end bg-slate-900/70 p-4 text-white">
                  <p className="text-sm font-medium">✨ AI Vision inspecting this photo — object, brand cues, and policy…</p>
                  <ul className="mt-3 space-y-1.5 text-xs">
                    {AI_SCAN_STEPS.map((step, i) => (
                      <li key={step} className={i <= scanStep ? "text-emerald-200" : "text-white/40"}>
                        {i < scanStep ? "✓" : i === scanStep ? "●" : "○"} {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {phase === "denied" && deny && (
            <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <p className="font-semibold">Listing blocked</p>
              <p className="leading-relaxed">{deny.en}</p>
              <p className="break-words leading-relaxed">{deny.my}</p>
              <button
                type="button"
                onClick={() => {
                  reset();
                }}
                className="w-full rounded-xl bg-white py-2 font-medium text-rose-700 ring-1 ring-rose-200"
              >
                Try another product photo
              </button>
            </div>
          )}

          {phase === "form" && vision && (
            <>
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                AI match: {vision.title} · Condition Score {vision.conditionScore}% {vision.conditionLabel}
              </p>
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
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
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
                    <button type="button" onClick={() => setDescLang("en")} className={`rounded-full px-2.5 py-1 ${descLang === "en" ? "bg-emerald-600 text-white" : "text-slate-600"}`}>
                      English
                    </button>
                    <button type="button" onClick={() => setDescLang("my")} className={`rounded-full px-2.5 py-1 ${descLang === "my" ? "bg-emerald-600 text-white" : "text-slate-600"}`}>
                      မြန်မာ
                    </button>
                  </div>
                </div>
                <textarea
                  value={descLang === "en" ? descEn : descMy}
                  onChange={(e) => (descLang === "en" ? setDescEn(e.target.value) : setDescMy(e.target.value))}
                  rows={3}
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">AI fair price range · {formatKs(price)}</p>
                <input
                  type="range"
                  min={priceMin}
                  max={priceMax}
                  step={3600}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                  <span>{formatKs(priceMin)} Fast Sale</span>
                  <span>{formatKs(priceMax)} High Value</span>
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
                        mode === key ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">More angles (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {gallery.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt="" className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
                  ))}
                  <button
                    type="button"
                    onClick={() => extraRef.current?.click()}
                    className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xl text-slate-400"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void publish()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                <Sparkles className="h-4 w-4" />
                {t[uiLang].publish}
              </button>
              {error && <p className="text-center text-sm text-rose-600">{error}</p>}
            </>
          )}

          {phase === "published" && (
            <div className="rounded-2xl bg-emerald-50 px-4 py-8 text-center text-emerald-800">
              <p className="text-lg font-semibold">✨ Listing live in your neighborhood</p>
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
            if (file) void onFile(file);
          }}
        />
        <input ref={extraRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void addExtras(e.target.files)} />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { formatKs } from "@/lib/money";
import { fileToJpegDataUrl } from "@/lib/aiVision";
import type { Product } from "@/lib/types";
import { useApp } from "./AppProvider";

function errText(e: unknown) {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "message" in e) return String((e as { message: string }).message);
  return "Could not save. Try again.";
}

export default function MyListings() {
  const { products, user, patchProduct, removeProduct } = useApp();
  const mine = products.filter((p) => p.userId === user?.id);
  const [openId, setOpenId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  if (!user) return null;

  const openEdit = (p: Product) => {
    setOpenId(p.id);
    setTitle(p.title);
    setPrice(p.price);
    setNote("");
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setNote("");
    try {
      await fn();
    } catch (e) {
      setNote(errText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">My listings</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        Tap a listing to edit it here. Mark <span className="font-medium text-slate-700">Sold out</span> or{" "}
        <span className="font-medium text-slate-700">Relist</span> on the same card — not in chat. Chat is only for
        buyers messaging you.
      </p>

      {mine.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No listings yet. Use + Sell Item.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {mine.map((p) => {
            const open = openId === p.id;
            const sold = p.status === "sold";
            return (
              <li
                key={p.id}
                className={`overflow-hidden rounded-2xl border ${
                  sold ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => (open ? setOpenId(null) : openEdit(p))}
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{p.title}</p>
                    <p className="text-sm text-emerald-700">{formatKs(p.price)}</p>
                    <p className="text-xs text-slate-500">{sold ? "Sold out — hidden from new buyers" : "Active on the feed"}</p>
                  </div>
                  <Pencil className={`h-4 w-4 shrink-0 ${open ? "text-emerald-600" : "text-slate-400"}`} />
                </button>

                <div className="flex gap-2 border-t border-slate-100 px-3 py-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void run(() => patchProduct(p.id, { status: sold ? "active" : "sold" }))}
                    className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                      sold ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-950"
                    }`}
                  >
                    {sold ? "Relist" : "Mark sold out"}
                  </button>
                  <Link
                    href={`/product/${p.id}`}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm("Delete this listing?")) void run(() => removeProduct(p.id));
                    }}
                    className="rounded-xl border border-rose-200 px-3 py-2 text-rose-700"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {open && (
                  <div className="space-y-3 border-t border-slate-100 bg-slate-50 p-3">
                    <label className="block text-xs font-medium text-slate-600">
                      Title
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600">
                      Price (Ks)
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600">
                      Extra photos (optional)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="mt-1 block w-full text-xs"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files?.length) return;
                          void run(async () => {
                            const extra = [...(p.images ?? [p.image])].filter((u) => u.startsWith("http"));
                            for (const f of Array.from(files).slice(0, 4)) {
                              extra.push(await fileToJpegDataUrl(f, 640));
                            }
                            const slim = extra.slice(0, 5);
                            const bytes = slim.reduce((n, s) => n + s.length, 0);
                            if (bytes > 180_000) {
                              throw new Error("Photos are too large to save. Use 1–2 smaller shots.");
                            }
                            await patchProduct(p.id, { gallery: slim });
                          });
                        }}
                      />
                    </label>
                    {note && open && <p className="text-xs text-rose-600">{note}</p>}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            await patchProduct(p.id, { title, price });
                            setOpenId(null);
                          })
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        <Check className="h-4 w-4" />
                        Save changes
                      </button>
                      <button type="button" className="px-3 text-sm text-slate-500" onClick={() => setOpenId(null)}>
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {note && !openId && <p className="mt-3 text-xs text-rose-600">{note}</p>}
    </div>
  );
}

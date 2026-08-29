"use client";

import { useState } from "react";
import { formatKs } from "@/lib/money";
import { fileToJpegDataUrl } from "@/lib/aiVision";
import { useApp } from "./AppProvider";

export default function MyListings() {
  const { products, user, patchProduct, removeProduct } = useApp();
  const mine = products.filter((p) => p.userId === user?.id);
  const [editId, setEditId] = useState<string | null>(null);
  const editing = mine.find((p) => p.id === editId);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">My listings</h2>
      <p className="mb-3 text-xs text-slate-500">Edit, mark sold out, add photos, or delete.</p>
      {mine.length === 0 ? (
        <p className="text-sm text-slate-500">You have no listings yet. Use + Sell Item.</p>
      ) : (
        <ul className="space-y-3">
          {mine.map((p) => (
            <li key={p.id} className="flex gap-3 rounded-xl border border-slate-100 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="text-xs text-slate-500">
                  {formatKs(p.price)} · {p.status === "sold" ? "Sold out" : "Active"}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px]"
                    onClick={() => {
                      setEditId(p.id);
                      setTitle(p.title);
                      setPrice(p.price);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800"
                    onClick={() => void patchProduct(p.id, { status: p.status === "sold" ? "active" : "sold" })}
                  >
                    {p.status === "sold" ? "Relist" : "Sold out"}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-50 px-2 py-0.5 text-[11px] text-rose-700"
                    onClick={() => {
                      if (window.confirm("Delete this listing?")) void removeProduct(p.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">Edit {editing.title}</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
          <label className="block text-xs text-slate-500">
            Add extra photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-1 block w-full text-xs"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files?.length) return;
                const extra: string[] = [...(editing.images ?? [editing.image])];
                for (const f of Array.from(files)) {
                  extra.push(await fileToJpegDataUrl(f, 900));
                }
                await patchProduct(editing.id, { gallery: extra.slice(0, 8) });
              }}
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              onClick={async () => {
                await patchProduct(editing.id, { title, price });
                setEditId(null);
              }}
            >
              Save
            </button>
            <button type="button" className="text-xs text-slate-500" onClick={() => setEditId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

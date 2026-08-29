"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function MakeOfferModal({
  open,
  askingPrice,
  onClose,
  onSubmit,
}: {
  open: boolean;
  askingPrice: number;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(Math.max(1, Math.round(askingPrice * 0.9)));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Make an offer</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-slate-500">Asking price ${askingPrice}</p>
        <div className="relative mt-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-7 pr-3 text-lg font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            onSubmit(amount);
            onClose();
          }}
          className="mt-4 w-full rounded-2xl bg-emerald-600 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          Send offer
        </button>
      </div>
    </div>
  );
}

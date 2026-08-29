"use client";

import { MapPin, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  { label: "Counter-offer 79,200 Ks", fill: "Would you take 79,200 Ks if I pick up today at City Mall?" },
  { label: "Ask about condition", fill: "Can you share a close-up of any scratches or wear?" },
  { label: "Propose public meetup", fill: "Let’s meet at City Mall Central Lobby — public & monitored." },
];

export default function AIDealCopilot({
  onUseSuggestion,
}: {
  onUseSuggestion: (text: string) => void;
}) {
  return (
    <aside className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
        <Sparkles className="h-4 w-4" />
        AI Deal Copilot
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-600">
        Based on local comps and seller trust, a 79,200–86,400 Ks close is likely if you offer a same-day public meetup.
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onUseSuggestion(s.fill)}
            className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50"
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2 rounded-xl bg-white/80 p-3 text-xs text-slate-700 ring-1 ring-slate-200">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p className="break-words leading-relaxed">
          📍 Recommended Safe Exchange Zone nearby: City Mall Central Lobby (Public &amp; Monitored)
        </p>
      </div>
    </aside>
  );
}

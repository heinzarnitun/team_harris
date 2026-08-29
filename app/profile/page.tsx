"use client";

import { BadgeCheck, Leaf, ShieldCheck } from "lucide-react";
import MyListings from "@/components/MyListings";
import { t } from "@/lib/i18n";
import { useApp } from "@/components/AppProvider";

export default function ProfilePage() {
  const { user, logout, setAuthOpen, lang } = useApp();
  const copy = t[lang];

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600">{copy.loginToSell}</p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="mt-4 rounded-2xl bg-emerald-600 px-4 py-2 font-semibold text-white"
        >
          {copy.login}
        </button>
        <p className="mt-3 break-words text-xs text-slate-500">{copy.demo}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              user.avatar_url ||
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80"
            }
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h1 className="flex items-center gap-1 text-xl font-bold text-slate-900">
              {user.name}
              {user.verified && <BadgeCheck className="h-5 w-5 text-emerald-600" />}
            </h1>
            <p className="break-words text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <ShieldCheck className="mb-1 h-4 w-4 text-emerald-600" />
            <p className="font-semibold">{user.trust_score}% trust</p>
            <p className="text-xs text-slate-500">Verified local identity</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-900">
            <Leaf className="mb-1 h-4 w-4" />
            <p className="font-semibold">CO₂ Impact</p>
            <p className="text-xs">Circular Economy member</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-5 w-full rounded-2xl border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {copy.logout}
        </button>
      </div>
      <MyListings />
      <p className="break-words rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
        ကြိုဆိုပါတယ်။ EcoLoop သည် AI Verified Second-Hand ပစ္စည်းများကို အနီးအနားတွင် Barter၊ ရောင်းချ၊
        လက်ဆောင်ပေးနိုင်သော Circular Economy စျေးကွက် ဖြစ်သည်။
      </p>
    </div>
  );
}

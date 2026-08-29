import { CURRENT_USER } from "@/lib/mockData";
import { BadgeCheck, Leaf, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h1 className="flex items-center gap-1 text-xl font-bold text-slate-900">
              {CURRENT_USER.name}
              <BadgeCheck className="h-5 w-5 text-emerald-600" />
            </h1>
            <p className="text-sm text-slate-500">{CURRENT_USER.location} · EcoLoop member</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <ShieldCheck className="mb-1 h-4 w-4 text-emerald-600" />
            <p className="font-semibold">{CURRENT_USER.trustScore}% trust</p>
            <p className="text-xs text-slate-500">Verified local identity</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-900">
            <Leaf className="mb-1 h-4 w-4" />
            <p className="font-semibold">38.4 kg CO₂</p>
            <p className="text-xs">saved via reuse</p>
          </div>
        </div>
      </div>
      <p className="break-words rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
        ကြိုဆိုပါတယ်။ EcoLoop သည် AI ဖြင့် စစ်ဆေးသော ဒုတိယလက်ပစ္စည်းများကို အနီးအနားတွင် လဲလှယ်၊ ရောင်းချ၊
        လက်ဆောင်ပေးနိုင်သော စက်ဝိုင်းစျေးကွက် ဖြစ်သည်။
      </p>
    </div>
  );
}

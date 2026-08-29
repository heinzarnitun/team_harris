"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { t } from "@/lib/i18n";
import { DEMO_LOGIN } from "@/lib/supabaseClient";
import { useApp } from "./AppProvider";

export default function AuthModal() {
  const { authOpen, setAuthOpen, lang, login, register } = useApp();
  const copy = t[lang];
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState<string>(DEMO_LOGIN.email);
  const [password, setPassword] = useState<string>(DEMO_LOGIN.password);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!authOpen) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await login(email, password);
      else await register(name || email.split("@")[0], email, password);
      setAuthOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-5 shadow-xl sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{copy.authTitle}</h2>
            <p className="mt-1 break-words text-sm leading-relaxed text-slate-500">{copy.authSub}</p>
          </div>
          <button type="button" onClick={() => setAuthOpen(false)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4 rounded-2xl bg-emerald-50 px-3 py-2 text-xs leading-relaxed text-emerald-900">
          {copy.demo}
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "register" && (
            <label className="block text-sm font-medium text-slate-700">
              {copy.name}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                required
              />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-700">
            {copy.email}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {copy.password}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-emerald-600 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {mode === "login" ? copy.login : copy.register}
          </button>
        </form>
        <button
          type="button"
          className="mt-3 w-full text-center text-sm text-emerald-700"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? copy.needAccount : copy.haveAccount}
        </button>
      </div>
    </div>
  );
}

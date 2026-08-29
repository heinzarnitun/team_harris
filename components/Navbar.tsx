"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, MessageCircle, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { CURRENT_USER, MOCK_LOCATIONS } from "@/lib/mockData";
import { useApp } from "./AppProvider";

export default function Navbar() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    setSellModalOpen,
    unreadCount,
  } = useApp();
  const [locOpen, setLocOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 font-semibold tracking-tight text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-sm text-white shadow-sm">
            ✨
          </span>
          <span className="hidden sm:inline">EcoLoop</span>
        </Link>

        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setLocOpen((o) => !o)}
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            📍 {location}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {locOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              {MOCK_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setLocation(loc);
                    setLocOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-emerald-50 ${
                    loc === location ? "bg-emerald-50 font-medium text-emerald-700" : "text-slate-700"
                  }`}
                >
                  📍 {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="relative min-w-0 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "/search");
          }}
        >
          <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search with AI (e.g., 'compact wooden desk under $50')..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setSellModalOpen(true)}
            className="hidden items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Sell Item
          </button>
          <Link
            href="/chat"
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Messages"
          >
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </Link>
          <Link href="/profile" className="hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-100"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

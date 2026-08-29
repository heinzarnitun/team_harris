"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ImagePlus, Send, Sparkles } from "lucide-react";
import { formatKs } from "@/lib/money";
import { t } from "@/lib/i18n";
import { GUIDE_STARTERS_EN, GUIDE_STARTERS_MY, marketGuideReply } from "@/lib/marketBot";
import type { Product } from "@/lib/types";
import { useApp } from "./AppProvider";
import AIDealCopilot from "./AIDealCopilot";
import MakeOfferModal from "./MakeOfferModal";

const GUIDE_ID = "ecoloop-guide";

type GuideMsg = {
  id: string;
  role: "user" | "bot";
  text: string;
  listings?: Product[];
  sellCta?: boolean;
};

export default function ChatWorkspace() {
  const { chats, products, addChatMessage, user, setAuthOpen, lang, location, setSellModalOpen, openChatWithSeller } =
    useApp();
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("c");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [mobileShowThread, setMobileShowThread] = useState(Boolean(requested));
  const [draft, setDraft] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const [guideMsgs, setGuideMsgs] = useState<GuideMsg[]>([
    {
      id: "g0",
      role: "bot",
      text:
        lang === "my"
          ? "မင်္ဂလာပါ — EcoLoop Guide ပါ။ ရောင်းချင်တာ၊ ဝယ်ချင်တာ၊ အနီးအနား ဈေးနှုန်း ပြောပါ။"
          : "Hi — I’m EcoLoop Guide. Ask what to sell, what to buy, what’s moving in your area, and typical Ks ranges.",
    },
  ]);
  const copy = t[lang];
  const wantGuide = !requested && (!pickedId || pickedId === GUIDE_ID);
  const activeId = pickedId || requested || GUIDE_ID;
  const isGuide = activeId === GUIDE_ID || (wantGuide && !chats.some((c) => c.id === activeId));

  const thread = chats.find((c) => c.id === activeId);
  const product = useMemo(
    () => products.find((p) => p.id === thread?.productId),
    [products, thread?.productId],
  );

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600">{copy.loginToChat}</p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="mt-4 rounded-2xl bg-emerald-600 px-4 py-2 font-semibold text-white"
        >
          {copy.login}
        </button>
        <p className="mt-3 text-xs text-slate-500">{copy.demo}</p>
      </div>
    );
  }

  const sendDeal = async (text: string, offerAmount?: number) => {
    if (!thread) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    await addChatMessage(thread.id, trimmed, offerAmount);
    setDraft("");
  };

  const sendGuide = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = marketGuideReply(trimmed, products, lang, location);
    setGuideMsgs((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
      {
        id: `b-${Date.now()}`,
        role: "bot",
        text: reply.text,
        listings: reply.listings,
        sellCta: reply.sellCta,
      },
    ]);
    setDraft("");
  };

  const messageSeller = async (p: Product) => {
    if (user && p.userId === user.id) return;
    const id = await openChatWithSeller(p);
    if (id) router.push(`/chat?c=${id}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isGuide) sendGuide(draft);
    else void sendDeal(draft);
  };

  const starters = lang === "my" ? GUIDE_STARTERS_MY : GUIDE_STARTERS_EN;

  return (
    <div className="mx-auto flex h-[calc(100dvh-8.5rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:h-[calc(100dvh-6rem)]">
      <aside className={`${mobileShowThread ? "hidden md:flex" : "flex"} w-full flex-col border-r border-slate-200 md:w-80`}>
        <div className="border-b border-slate-200 px-4 py-3">
          <h1 className="font-semibold text-slate-900">{copy.messages}</h1>
          <p className="text-xs text-slate-500">EcoLoop Guide + local deal chats</p>
        </div>
        <ul className="flex-1 overflow-y-auto">
          <li>
            <button
              type="button"
              onClick={() => {
                setPickedId(GUIDE_ID);
                setMobileShowThread(true);
              }}
              className={`flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50 ${
                isGuide ? "bg-emerald-50" : ""
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">EcoLoop Guide</p>
                <p className="truncate text-xs text-slate-500">Buy, sell, area prices</p>
                <p className="truncate text-xs text-slate-400">Always on · live listings</p>
              </div>
            </button>
          </li>
          {chats.map((c) => {
            const p = products.find((prod) => prod.id === c.productId);
            const last = c.messages[c.messages.length - 1];
            const selected = !isGuide && c.id === thread?.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setPickedId(c.id);
                    setMobileShowThread(true);
                  }}
                  className={`flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50 ${
                    selected ? "bg-emerald-50" : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.otherParty.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                    {p && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt=""
                        className="absolute -bottom-1 -right-1 h-5 w-5 rounded-md object-cover ring-2 ring-white"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">{c.otherParty.name}</p>
                      {c.unread > 0 && (
                        <span className="rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-slate-500">{p?.title}</p>
                    <p className="truncate text-xs text-slate-400">{last?.text}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {isGuide ? (
        <section className={`${mobileShowThread ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}>
          <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
            <button
              type="button"
              className="mr-1 text-sm text-emerald-700 md:hidden"
              onClick={() => setMobileShowThread(false)}
            >
              Back
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">EcoLoop Guide</p>
              <p className="text-xs text-slate-500">Market chatbot · {location}</p>
            </div>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {guideMsgs.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[92%] space-y-2 rounded-2xl px-3 py-2 text-sm leading-relaxed break-words ${
                    m.role === "user" ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.sellCta && (
                    <button
                      type="button"
                      onClick={() => setSellModalOpen(true)}
                      className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white"
                    >
                      Open Snap to List
                    </button>
                  )}
                  {m.listings?.length ? (
                    <ul className="space-y-2">
                      {m.listings.map((p) => (
                        <li key={p.id} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          <Link href={`/product/${p.id}`} className="flex gap-2 p-2 text-left hover:bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                            <span className="min-w-0 flex-1">
                              <span className="line-clamp-2 font-semibold text-slate-900">{p.title}</span>
                              <span className="mt-0.5 block text-xs text-emerald-700">{formatKs(p.price)}</span>
                              <span className="block text-[11px] text-slate-500">{p.location}</span>
                            </span>
                          </Link>
                          {user && p.userId !== user.id && (
                            <button
                              type="button"
                              onClick={() => void messageSeller(p)}
                              className="w-full border-t border-slate-200 py-1.5 text-[11px] font-semibold text-emerald-800"
                            >
                              Message seller
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendGuide(s)}
                  className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-800"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-slate-200 p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              placeholder={lang === "my" ? "ဝယ်/ရောင်း/ဈေး ပြောပါ..." : "Ask about buying, selling, or local prices..."}
              className="max-h-32 min-h-[44px] flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button type="submit" className="rounded-xl bg-emerald-600 p-2 text-white hover:bg-emerald-700" aria-label="Send">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </section>
      ) : thread && product ? (
        <section className={`${mobileShowThread ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}>
          <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
            <button
              type="button"
              className="mr-1 text-sm text-emerald-700 md:hidden"
              onClick={() => setMobileShowThread(false)}
            >
              Back
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{product.title}</p>
              <p className="text-xs text-slate-500">
                {formatKs(product.price)} · with {thread.otherParty.name}
                {thread.activeOffer != null ? ` · active offer ${formatKs(thread.activeOffer)}` : ""}
              </p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            <AIDealCopilot onUseSuggestion={setDraft} />
            {thread.messages.map((m) => {
              const mine = m.sender === "buyer";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words ${
                      mine ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.offerAmount != null && (
                      <p className={`mt-1 text-xs font-semibold ${mine ? "text-emerald-100" : "text-emerald-700"}`}>
                        💰 Offer {formatKs(m.offerAmount)}
                      </p>
                    )}
                    <p className={`mt-1 text-[10px] ${mine ? "text-emerald-100" : "text-slate-400"}`}>{m.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-slate-200 p-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              aria-label="Attach image"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              placeholder="Message with AI copilot..."
              className="max-h-32 min-h-[44px] flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setOfferOpen(true)}
              className="hidden rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 sm:block"
            >
              💰 Make Offer
            </button>
            <button type="submit" className="rounded-xl bg-emerald-600 p-2 text-white hover:bg-emerald-700" aria-label="Send">
              <Send className="h-5 w-5" />
            </button>
          </form>
          <div className="px-3 pb-3 sm:hidden">
            <button
              type="button"
              onClick={() => setOfferOpen(true)}
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-sm font-semibold text-emerald-800"
            >
              💰 Make Offer
            </button>
          </div>
          <MakeOfferModal
            open={offerOpen}
            askingPrice={product.price}
            onClose={() => setOfferOpen(false)}
            onSubmit={(amount) => sendDeal(`I'd like to offer ${formatKs(amount)} for this item.`, amount)}
          />
        </section>
      ) : (
        <section className="hidden min-w-0 flex-1 items-center justify-center text-sm text-slate-500 md:flex">
          Open EcoLoop Guide or a listing chat.
        </section>
      )}
    </div>
  );
}

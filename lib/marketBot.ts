import type { Lang } from "./i18n";
import { formatKs } from "./money";
import { aiMatchProduct, parseAiQuery } from "./search";
import type { Product } from "./types";

function median(nums: number[]) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function stats(list: Product[]) {
  const prices = list.map((p) => p.price);
  return {
    n: list.length,
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
    med: median(prices),
  };
}

function locKey(p: Product) {
  return (p.location || "Yangon").split("•")[0].trim() || "Yangon";
}

function byLocation(products: Product[]) {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const k = locKey(p);
    map.set(k, [...(map.get(k) || []), p]);
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
}

function byCategory(products: Product[]) {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    map.set(p.category, [...(map.get(p.category) || []), p]);
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
}

function townshipHint(userLocation: string) {
  return userLocation.split("•")[0].trim();
}

export function marketGuideReply(raw: string, products: Product[], lang: Lang, userLocation: string): string {
  const q = raw.trim();
  const my = lang === "my";
  const active = products.filter((p) => p.status !== "sold");
  const parsed = parseAiQuery(q);
  const matched = active.filter((p) => aiMatchProduct(p, parsed));
  const focused =
    parsed.terms.length || parsed.category || parsed.max != null || parsed.min != null ? matched : [];

  const sell = /\b(sell|listing|snap|list my|ရောင်း|တင်)\b/i.test(q);
  const buy = /\b(buy|want|looking|need|shop|ဝယ်|ရှာ)\b/i.test(q);
  const area = /\b(area|nearby|near me|township|yangon|mandalay|hlaing|kamayut|bahan|downtown|နယ်|အနီး|မြို့နယ်|ရန်ကုန်|မန္တလေး)\b/i.test(
    q,
  );
  const priceQ = /\b(price|how much|range|cost|worth|ဈေး|နှုန်း|ဘယ်လောက်)\b/i.test(q);
  const here = townshipHint(userLocation);
  const local = active.filter((p) => locKey(p).toLowerCase().includes(here.split(" ")[0].toLowerCase()));
  const townRows = byLocation(active).slice(0, 6);
  const catRows = byCategory(active).slice(0, 6);

  if (sell) {
    const cat = parsed.category || "⚡ Electronics";
    const same = active.filter((p) => p.category === cat);
    const s = stats(same.length ? same : active);
    if (my) {
      return `ရောင်းချင်ရင် Snap to List ဖွင့်ပြီး ပစ္စည်းကို ဖရိန်ပြည့်အောင် ရိုက်ပါ (စားပွဲကို မဟုတ်)။ ${cat} လက်ရှိ ${same.length || active.length} ခု၊ ဈေး ${formatKs(s.min)} – ${formatKs(s.max)} (ပျမ်းမျှ ${formatKs(s.med)})။ ချွတ်ယွင်းချက်၊ ထောင့်ဓာတ်ပုံ၊ မျှတသော ဈေး ထည့်ပါ။`;
    }
    return `To sell: Snap to List, photograph the item filling the frame (not the table). Typical ${cat} on EcoLoop now: ${formatKs(s.min)} – ${formatKs(s.max)} (median ${formatKs(s.med)} across ${same.length || active.length} listings). Add defects and a fair asking price. Pickup in ${here} closes faster.`;
  }

  if (focused.length && (buy || priceQ || parsed.terms.length > 0 || parsed.category)) {
    const s = stats(focused);
    const sample = focused
      .slice(0, 4)
      .map((p) => `• ${p.title} — ${formatKs(p.price)} (${locKey(p)})`)
      .join("\n");
    if (my) {
      return `ရှာတွေ့ ${focused.length} ခု။ ဈေး ${formatKs(s.min)} – ${formatKs(s.max)} (ပျမ်းမျှ ${formatKs(s.med)})။\n${sample}\nListing ဖွင့်ပြီး ရောင်းသူကို chat လုပ်ပါ။`;
    }
    return `Found ${focused.length} live listing(s). Range ${formatKs(s.min)} – ${formatKs(s.max)} (median ${formatKs(s.med)}).\n${sample}\nOpen a card to message the seller, or search the feed.`;
  }

  if (area || /\bnear me\b/i.test(q)) {
    const focus = local.length ? local : active;
    const s = stats(focus);
    const towns = townRows.map(([t, list]) => `${t} (${list.length})`).join(", ");
    if (my) {
      return `${here} အနီး live ${focus.length} ခု။ ဈေး ${formatKs(s.min)} – ${formatKs(s.max)}။ နေရာများ: ${towns}။ ဘာဝယ်/ရောင်းချင်လဲ ပြောပါ။`;
    }
    return `Near ${here}: ${focus.length} live listings, ${formatKs(s.min)} – ${formatKs(s.max)}. Busiest spots: ${towns}. Tell me a product (phone, laptop, books) or “I want to sell…”.`;
  }

  if (priceQ) {
    const lines = catRows.map(([c, list]) => {
      const s = stats(list);
      return `• ${c}: ${formatKs(s.min)} – ${formatKs(s.max)} (median ${formatKs(s.med)}, ${list.length} items)`;
    });
    if (my) return `အမျိုးအစားအလိုက် ဈေး:\n${lines.join("\n")}`;
    return `Live price bands by category:\n${lines.join("\n")}`;
  }

  const overview = catRows.map(([c, list]) => `${c.replace(/^[^A-Za-z]+/, "")} ${list.length}`).join(" · ");
  const s = stats(active);
  if (my) {
    return `EcoLoop မှာ live ${active.length} ခု (${overview})။ ဈေး ${formatKs(s.min)} – ${formatKs(s.max)}။ ဥပမာ “ဖုန်း ဝယ်ချင်တယ်”, “လက်ပ်တော့ ရောင်းမယ်”, “အနီးမှာ ဘာရောင်းလဲ”.`;
  }
  return `EcoLoop has ${active.length} live listings (${overview}). Overall ${formatKs(s.min)} – ${formatKs(s.max)}. Ask “phones under 400000 Ks”, “what should I sell my laptop for?”, or “what’s selling near me”.`;
}

export const GUIDE_STARTERS_EN = [
  "What's selling near me?",
  "Phone price range",
  "I want to sell a laptop",
  "What can I buy in Yangon?",
];

export const GUIDE_STARTERS_MY = [
  "အနီးမှာ ဘာရောင်းနေလဲ",
  "ဖုန်း ဈေးနှုန်း",
  "လက်ပ်တော့ ရောင်းချင်တယ်",
  "ရန်ကုန်မှာ ဘာဝယ်လို့ရလဲ",
];

import type { Lang } from "./i18n";
import { formatKs } from "./money";
import { aiMatchProduct, parseAiQuery } from "./search";
import type { Product } from "./types";

export type GuideReply = {
  text: string;
  listings: Product[];
  sellCta: boolean;
};

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

export function marketGuideReply(raw: string, products: Product[], lang: Lang, userLocation: string): GuideReply {
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
    const listings = (same.length ? same : active).slice(0, 4);
    if (my) {
      return {
        text: `ရောင်းချင်ရင် အောက်က Snap to List ကို နှိပ်ပါ။ ပစ္စည်းကို ဖရိန်ပြည့်အောင် ရိုက်ပါ။ ${cat} ဈေး ${formatKs(s.min)} – ${formatKs(s.max)} (ပျမ်းမျှ ${formatKs(s.med)})။ အောက်က ကတ်တွေက နမူနာ listings ဖြစ်သည်။`,
        listings,
        sellCta: true,
      };
    }
    return {
      text: `Tap Snap to List below to photograph the item (fill the frame). Typical ${cat} now: ${formatKs(s.min)} – ${formatKs(s.max)} (median ${formatKs(s.med)}). Sample live listings under this message — tap a card to open it.`,
      listings,
      sellCta: true,
    };
  }

  if (focused.length && (buy || priceQ || parsed.terms.length > 0 || parsed.category)) {
    const s = stats(focused);
    const listings = focused.slice(0, 6);
    if (my) {
      return {
        text: `ရှာတွေ့ ${focused.length} ခု။ ဈေး ${formatKs(s.min)} – ${formatKs(s.max)} (ပျမ်းမျှ ${formatKs(s.med)})။ အောက်က ကတ်ကို နှိပ်ပြီး listing ဖွင့်ပါ။`,
        listings,
        sellCta: false,
      };
    }
    return {
      text: `Found ${focused.length} live listing(s). Range ${formatKs(s.min)} – ${formatKs(s.max)} (median ${formatKs(s.med)}). Tap a card below to open the listing, then message the seller.`,
      listings,
      sellCta: false,
    };
  }

  if (area || /\bnear me\b/i.test(q)) {
    const focus = local.length ? local : active;
    const s = stats(focus);
    const towns = townRows.map(([t, list]) => `${t} (${list.length})`).join(", ");
    const listings = focus.slice(0, 6);
    if (my) {
      return {
        text: `${here} အနီး live ${focus.length} ခု။ ဈေး ${formatKs(s.min)} – ${formatKs(s.max)}။ နေရာများ: ${towns}။ အောက်က ကတ်ကို နှိပ်ပါ။`,
        listings,
        sellCta: false,
      };
    }
    return {
      text: `Near ${here}: ${focus.length} live listings, ${formatKs(s.min)} – ${formatKs(s.max)}. Busiest spots: ${towns}. Tap a card below to open it.`,
      listings,
      sellCta: false,
    };
  }

  if (priceQ) {
    const lines = catRows.map(([c, list]) => {
      const s = stats(list);
      return `• ${c}: ${formatKs(s.min)} – ${formatKs(s.max)} (median ${formatKs(s.med)}, ${list.length} items)`;
    });
    return {
      text: my ? `အမျိုးအစားအလိုက် ဈေး:\n${lines.join("\n")}\nနမူနာကတ်များကို အောက်တွင် နှိပ်ပါ။` : `Live price bands by category:\n${lines.join("\n")}\nTap a sample card below.`,
      listings: active.slice(0, 6),
      sellCta: false,
    };
  }

  const overview = catRows.map(([c, list]) => `${c.replace(/^[^A-Za-z]+/, "")} ${list.length}`).join(" · ");
  const s = stats(active);
  if (my) {
    return {
      text: `EcoLoop မှာ live ${active.length} ခု (${overview})။ ဈေး ${formatKs(s.min)} – ${formatKs(s.max)}။ အောက်က ကတ် သို့မဟုတ် “ဖုန်း ဝယ်ချင်တယ်” လို့ ရိုက်ပါ။`,
      listings: active.slice(0, 4),
      sellCta: false,
    };
  }
  return {
    text: `EcoLoop has ${active.length} live listings (${overview}). Overall ${formatKs(s.min)} – ${formatKs(s.max)}. Tap a card below, or ask “phones under 400000 Ks”.`,
    listings: active.slice(0, 4),
    sellCta: false,
  };
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

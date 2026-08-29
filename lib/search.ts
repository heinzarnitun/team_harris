import type { CategoryName, Product } from "./types";
import { queryAmountToKs } from "./money";

const STOP = new Set([
  "a","an","the","with","for","from","and","or","of","to","in","on","ai","e.g","eg","under","below","than","less","more","over","above","please","find","me","i","want","looking","need","show","search",
]);

const SYNONYMS: Record<string, string[]> = {
  desk: ["desk", "table", "oak", "wooden", "စားပွဲ"],
  table: ["desk", "table", "oak", "wooden", "စားပွဲ"],
  wooden: ["wood", "wooden", "oak", "teak", "သစ်သား"],
  compact: ["compact", "small", "mini", "ကျစ်လစ်"],
  laptop: ["laptop", "macbook", "notebook", "air"],
  macbook: ["macbook", "laptop", "apple"],
  phone: ["iphone", "phone", "smartphone"],
  iphone: ["iphone", "phone"],
  bike: ["bike", "bicycle", "cycle", "စက်ဘီး"],
  bicycle: ["bike", "bicycle", "စက်ဘီး"],
  jacket: ["jacket", "leather", "coat", "ဂျာကင်"],
  book: ["book", "books", "hardcover", "စာအုပ်"],
  keyboard: ["keyboard", "keychron", "mechanical"],
  planter: ["planter", "pot", "plant", "ceramic"],
  camera: ["camera", "canon", "sony", "lens"],
  guitar: ["guitar", "acoustic", "ဂစ်တာ"],
  headphones: ["headphones", "headset", "ear", "sony"],
  lamp: ["lamp", "light", "မီးအိမ်"],
  cooker: ["cooker", "rice", "kitchen"],
  yoga: ["yoga", "mat", "fitness"],
  speaker: ["speaker", "bluetooth", "audio"],
  monitor: ["monitor", "screen", "display"],
  chair: ["chair", "stool", "ထိုင်ခုံ"],
};

type Parsed = {
  max?: number;
  min?: number;
  barter: boolean;
  verified: boolean;
  category?: Exclude<CategoryName, "All">;
  terms: string[];
};

export function parseAiQuery(raw: string): Parsed {
  const q = raw.trim().toLowerCase().replace(/[,]/g, "");
  const parsed: Parsed = { barter: /barter|swap|လဲလှယ်/.test(q), verified: /verified|ai verified/.test(q), terms: [] };

  const under = q.match(/(?:under|below|less than|အောက်)\s*\$?\s*(\d+)/);
  const over = q.match(/(?:over|above|more than)\s*\$?\s*(\d+)/);
  const ks = q.match(/(\d+)\s*ks/);
  const dollar = q.match(/\$\s*(\d+)/);
  if (under) parsed.max = queryAmountToKs(Number(under[1]));
  if (over) parsed.min = queryAmountToKs(Number(over[1]));
  if (ks && parsed.max == null && parsed.min == null) parsed.max = Number(ks[1]);
  if (dollar && parsed.max == null) parsed.max = queryAmountToKs(Number(dollar[1]));

  if (/electronic|laptop|phone|keyboard|headphone|monitor|camera/.test(q)) parsed.category = "⚡ Electronics";
  else if (/fashion|jacket|dress|shoe|bag/.test(q)) parsed.category = "👗 Fashion";
  else if (/book|novel|read/.test(q)) parsed.category = "📚 Books";
  else if (/plant|eco|purifier|solar|bamboo/.test(q)) parsed.category = "🌱 Eco-Deals";
  else if (/desk|furniture|chair|barter/.test(q) && /swap|barter|desk/.test(q)) {
    if (/desk|table|chair/.test(q)) parsed.category = undefined;
  }

  parsed.terms = q
    .replace(/\$\d+/g, " ")
    .replace(/\d+\s*ks/g, " ")
    .replace(/\d+/g, " ")
    .split(/[^a-zA-Z\u1000-\u109F]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP.has(w));

  return parsed;
}

export function aiMatchProduct(p: Product, parsed: Parsed) {
  if (parsed.max != null && p.price > parsed.max) return false;
  if (parsed.min != null && p.price < parsed.min) return false;
  if (parsed.barter && !p.barterAvailable) return false;
  if (parsed.verified && !p.aiVerified) return false;
  if (parsed.category && p.category !== parsed.category) return false;
  if (parsed.terms.length === 0) return true;
  const hay = `${p.title} ${p.description} ${p.descriptionMy} ${p.category} ${p.location} ${p.seller.name}`.toLowerCase();
  const hits = parsed.terms.filter((term) => (SYNONYMS[term] ?? [term]).some((a) => hay.includes(a)));
  const need = parsed.terms.length <= 2 ? 1 : Math.ceil(parsed.terms.length * 0.4);
  return hits.length >= need;
}

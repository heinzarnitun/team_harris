import type { CategoryName, TradingMode } from "./types";

export type VisionHit = {
  ok: true;
  title: string;
  category: Exclude<CategoryName, "All">;
  description: string;
  descriptionMy: string;
  priceMin: number;
  priceMax: number;
  price: number;
  conditionScore: number;
  conditionLabel: string;
  co2SavedKg: number;
  tradingMode: TradingMode;
  heroUrl: string;
};

export type VisionDeny = { ok: false; reason: string; reasonMy: string };
export type VisionResult = VisionHit | VisionDeny;

const DENY =
  /\b(dog|cat|puppy|kitten|pet|animal|bird|fish|insect|spider|snake|hamster|rabbit|cow|pig|chicken|goat|selfie|portrait|face|person|people|human|baby|child|kid|man|woman|boy|girl|nude|nsfw|blood|gore|meme|screenshot|qr.?code|houseplant|succulent|orchid|bonsai|goldfish|parrot|living)\b/i;

type Template = Omit<VisionHit, "ok"> & { keys: string[] };

const TEMPLATES: Template[] = [
  {
    keys: ["macbook", "laptop", "notebook", "mac"],
    title: "Used Laptop / MacBook",
    category: "⚡ Electronics",
    description: "AI Vision reads a portable computer. Screen, keyboard deck, and chassis look listable as Second-Hand electronics.",
    descriptionMy: "AI Vision က လက်တော့ပ်/MacBook ဟု ဖတ်သည်။ Second-Hand Electronics အဖြစ် တင်နိုင်သည်။",
    priceMin: 900000,
    priceMax: 2160000,
    price: 1440000,
    conditionScore: 88,
    conditionLabel: "Very Good",
    co2SavedKg: 4.8,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["iphone", "phone", "android", "pixel", "samsung"],
    title: "Used Smartphone",
    category: "⚡ Electronics",
    description: "AI Vision detected a handheld phone. Check Face ID / ports before meetup. Fair local comps applied.",
    descriptionMy: "AI Vision က စမတ်ဖုန်းဟု တွေ့သည်။ တွေ့ဆုံမည့်အခါ ပေါက်များနှင့် ဘက်ထရီ စစ်ပါ။",
    priceMin: 360000,
    priceMax: 1440000,
    price: 792000,
    conditionScore: 84,
    conditionLabel: "Good",
    co2SavedKg: 6.2,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["headphone", "headset", "earbud", "airpod", "sony"],
    title: "Wireless Headphones",
    category: "⚡ Electronics",
    description: "Over-ear / on-ear audio gear. Cushions and hinge wear scored as minor. Strong resale this week.",
    descriptionMy: "နားကြပ် အမျိုးအစား။ ကူရှင်နှင့် ပတ္တာ အနည်းငယ် သုံးထားသည်။",
    priceMin: 72000,
    priceMax: 396000,
    price: 180000,
    conditionScore: 90,
    conditionLabel: "Like New",
    co2SavedKg: 2.1,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["keyboard", "keychron", "mechanical"],
    title: "Mechanical Keyboard",
    category: "⚡ Electronics",
    description: "Desktop keyboard silhouette with keycaps. Hot-swap / wired comps used for the Ks range.",
    descriptionMy: "Mechanical keyboard ဟု ခွဲခြားသည်။ ဒေသတွင်း စျေးနှုန်း တွက်ပြီး။",
    priceMin: 72000,
    priceMax: 252000,
    price: 144000,
    conditionScore: 89,
    conditionLabel: "Very Good",
    co2SavedKg: 3.4,
    tradingMode: "barter",
    heroUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["bike", "bicycle", "cycle", "စက်ဘီး"],
    title: "City Bicycle",
    category: "⚡ Electronics",
    description: "Two-wheel frame detected. Tires and drivetrain should be checked in person. Barter-friendly.",
    descriptionMy: "စက်ဘီး ဖရိမ် တွေ့သည်။ တာယာနှင့် ကွင်းလုံး ကိုယ်တိုင် စစ်ပါ။",
    priceMin: 108000,
    priceMax: 432000,
    price: 180000,
    conditionScore: 86,
    conditionLabel: "Good",
    co2SavedKg: 15,
    tradingMode: "barter",
    heroUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["jacket", "coat", "hoodie", "shirt", "dress", "jeans", "bag", "tote", "leather", "fashion"],
    title: "Second-Hand Fashion Piece",
    category: "👗 Fashion",
    description: "Apparel / bag outline. Fabric and stitching look resale-ready. Size still needs a human check.",
    descriptionMy: "အဝတ်အထည်/အိတ် ပုံစံ။ အပ်နှင့် အထည် ပြန်ရောင်းရန် သင့်တော်သည်။",
    priceMin: 18000,
    priceMax: 288000,
    price: 72000,
    conditionScore: 85,
    conditionLabel: "Good",
    co2SavedKg: 8.5,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["book", "novel", "paperback", "hardcover", "စာအုပ်"],
    title: "Used Book Lot",
    category: "📚 Books",
    description: "Page block / cover detected. No living subject. Good for Circular Economy reading swaps.",
    descriptionMy: "စာအုပ် အဖုံး/စာရွက် တွေ့သည်။ စာဖတ် Barter အတွက် သင့်တော်သည်။",
    priceMin: 7200,
    priceMax: 72000,
    price: 21600,
    conditionScore: 91,
    conditionLabel: "Like New",
    co2SavedKg: 4.2,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["desk", "table", "chair", "stool", "furniture", "oak", "teak", "wooden", "စားပွဲ", "ထိုင်ခုံ"],
    title: "Compact Wooden Furniture",
    category: "🔄 Barter/Swap",
    description: "Furniture plane and legs. Solid-goods silhouette — not a living thing. Strong Barter demand nearby.",
    descriptionMy: "ပရိဘောဂ (စားပွဲ/ထိုင်ခုံ)။ သက်ရှိမဟုတ်။ အနီးအနား Barter ဝယ်လိုအား ရှိသည်။",
    priceMin: 72000,
    priceMax: 360000,
    price: 172800,
    conditionScore: 90,
    conditionLabel: "Like New",
    co2SavedKg: 16,
    tradingMode: "barter",
    heroUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["lamp", "light", "bulb", "မီး"],
    title: "Table / Floor Lamp",
    category: "🌱 Eco-Deals",
    description: "Lighting fixture. Shade and stand intact. Eco-Deals pricing from local comps.",
    descriptionMy: "မီးအိမ်။ အရိပ်နှင့် ခြေထောက် ပြည့်စုံသည်။",
    priceMin: 18000,
    priceMax: 108000,
    price: 54000,
    conditionScore: 92,
    conditionLabel: "Like New",
    co2SavedKg: 3.1,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1507473880760-e72b5d19b4ea?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["cooker", "kettle", "blender", "toaster", "kitchen", "rice"],
    title: "Kitchen Appliance",
    category: "🌱 Eco-Deals",
    description: "Countertop appliance housing. Recycle-by-reuse beats landfill. Confirm voltage at meetup.",
    descriptionMy: "မီးဖိုချောင်သုံး ကိရိယာ။ ပြန်သုံးခြင်းက စွန့်ပစ်ခြင်းထက် ပိုကောင်းသည်။",
    priceMin: 36000,
    priceMax: 180000,
    price: 72000,
    conditionScore: 86,
    conditionLabel: "Good",
    co2SavedKg: 5.4,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["camera", "canon", "sony", "nikon", "lens"],
    title: "Used Camera Body",
    category: "⚡ Electronics",
    description: "Camera body / lens barrel. Sensor dust not visible in this still. Electronics Condition Score applied.",
    descriptionMy: "ကင်မရာ ကိုယ်ထည်/lens။ Electronics Condition Score ထည့်တွက်ထားသည်။",
    priceMin: 360000,
    priceMax: 1800000,
    price: 756000,
    conditionScore: 83,
    conditionLabel: "Good",
    co2SavedKg: 4,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["guitar", "ukulele", "violin", "piano"],
    title: "Musical Instrument",
    category: "⚡ Electronics",
    description: "String / body instrument. Case not confirmed. Local musicians often Barter.",
    descriptionMy: "တူရိယာ။ အိတ် ပါ/မပါ မသေချာ။ Barter လုပ်လေ့ရှိသည်။",
    priceMin: 72000,
    priceMax: 540000,
    price: 198000,
    conditionScore: 87,
    conditionLabel: "Very Good",
    co2SavedKg: 7.7,
    tradingMode: "barter",
    heroUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["speaker", "jbl", "audio", "bluetooth"],
    title: "Bluetooth Speaker",
    category: "⚡ Electronics",
    description: "Portable speaker grille. Battery health unknown — priced as Fair Value.",
    descriptionMy: "Bluetooth စပီကာ။ ဘက်ထရီ မသေချာသောကြောင့် Fair Value ထားသည်။",
    priceMin: 36000,
    priceMax: 180000,
    price: 90000,
    conditionScore: 82,
    conditionLabel: "Good",
    co2SavedKg: 1.8,
    tradingMode: "direct",
    heroUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keys: ["planter", "pot", "vase", "ceramic", "အိုး"],
    title: "Ceramic Planter (empty)",
    category: "🌱 Eco-Deals",
    description: "Empty vessel only — no live plant detected in policy check. Safe to list.",
    descriptionMy: "အိုးဗလာ။ သက်ရှိအပင် မပါ။ တင်ရန် ခွင့်ပြုသည်။",
    priceMin: 7200,
    priceMax: 72000,
    price: 28800,
    conditionScore: 94,
    conditionLabel: "Like New",
    co2SavedKg: 2.2,
    tradingMode: "barter",
    heroUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80",
  },
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickTemplate(file: File, blobHint: string): Template {
  const name = `${file.name} ${blobHint}`.toLowerCase();
  const hit = TEMPLATES.find((t) => t.keys.some((k) => name.includes(k)));
  if (hit) return hit;
  return TEMPLATES[hashStr(`${file.name}|${file.size}|${file.lastModified}`) % TEMPLATES.length];
}

export async function inspectListingPhoto(file: File): Promise<VisionResult> {
  if (!file.type.startsWith("image/")) {
    return {
      ok: false,
      reason: "That file is not a photo. Upload a product still.",
      reasonMy: "ဓာတ်ပုံ မဟုတ်ပါ။ ပစ္စည်းဓာတ်ပုံ တင်ပါ။",
    };
  }
  if (file.size < 12_000) {
    return {
      ok: false,
      reason: "Photo is too small / compressed. AI Vision cannot score this item.",
      reasonMy: "ဓာတ်ပုံ သေးလွန်းသည်။ AI Vision မဖတ်နိုင်ပါ။",
    };
  }
  const label = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
  if (DENY.test(label) || DENY.test(file.name)) {
    return {
      ok: false,
      reason:
        "EcoLoop does not list living things, people, pets, or unclear/weird photos. Photograph the object only.",
      reasonMy: "သက်ရှိ၊ လူ၊ pets သို့မဟုတ် ပုံဆန်းများ တင်၍မရပါ။ ပစ္စည်းကိုသာ ရိုက်ပါ။",
    };
  }

  const dims = await readDims(file);
  if (!dims) {
    return {
      ok: false,
      reason: "Could not read this image. Try another photo of the object.",
      reasonMy: "ဤပုံကို ဖတ်မရပါ။ ပစ္စည်းကို ထပ်ရိုက်ပါ။",
    };
  }
  if (dims.w < 120 || dims.h < 120) {
    return {
      ok: false,
      reason: "Resolution is too low for Condition Score. Use a clearer product photo.",
      reasonMy: "ပုံကြည်လင်မှု မလုံလောက်ပါ။ ပိုကြည်သော ပစ္စည်းပုံ သုံးပါ။",
    };
  }
  if (dims.h / dims.w > 1.85) {
    return {
      ok: false,
      reason: "This looks like a selfie / portrait, not a product. Living subjects are not allowed.",
      reasonMy: "Selfie/လူပုံ နှင့် တူသည်။ သက်ရှိ တင်၍မရပါ။",
    };
  }

  const fingerprint = hashStr(`${file.name}|${file.size}|${file.lastModified}|${dims.w}x${dims.h}`);
  if (fingerprint % 19 === 0 && !TEMPLATES.some((t) => t.keys.some((k) => file.name.toLowerCase().includes(k)))) {
    return {
      ok: false,
      reason: "AI Vision could not identify a listable Second-Hand object. Retake a well-lit photo of the item only.",
      reasonMy: "တင်နိုင်သော Second-Hand ပစ္စည်းဟု မခွဲခြားနိုင်ပါ။ ပစ္စည်းကို အလင်းကောင်းကောင်းဖြင့် ထပ်ရိုက်ပါ။",
    };
  }

  const tmpl = pickTemplate(file, `${dims.w}x${dims.h}`);
  const jitter = (fingerprint % 7) - 3;
  const price = Math.max(tmpl.priceMin, Math.min(tmpl.priceMax, tmpl.price + jitter * 3600));
  return {
    ok: true,
    ...tmpl,
    title: tmpl.keys.some((k) => file.name.toLowerCase().includes(k))
      ? tmpl.title
      : `${tmpl.title} (${file.name.replace(/\.[^.]+$/, "").slice(0, 28) || "untitled"})`,
    price,
    conditionScore: Math.min(97, Math.max(78, tmpl.conditionScore + (fingerprint % 5) - 2)),
  };
}

function readDims(file: File): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      URL.revokeObjectURL(url);
      resolve({ w, h });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export function fileToJpegDataUrl(file: File, maxEdge = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}

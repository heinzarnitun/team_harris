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

const PHONE: Template = {
  keys: ["iphone", "phone", "android", "pixel", "samsung", "xiaomi", "oppo", "vivo", "galaxy", "smartphone", "mobile"],
  title: "Used Smartphone",
  category: "⚡ Electronics",
  description:
    "AI Vision sees a handheld phone (often sitting on a table). Fill the frame with the device, then check ports and battery at meetup.",
  descriptionMy: "AI Vision က စမတ်ဖုန်းဟု တွေ့သည် (စားပွဲပေါ်တင်ထားလျှင်ပင်)။ တွေ့ဆုံမည့်အခါ ပေါက်များနှင့် ဘက်ထရီ စစ်ပါ။",
  priceMin: 360000,
  priceMax: 1440000,
  price: 792000,
  conditionScore: 84,
  conditionLabel: "Good",
  co2SavedKg: 6.2,
  tradingMode: "direct",
  heroUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=1200&q=80",
};

const LAPTOP: Template = {
  keys: ["macbook", "laptop", "notebook", "mac", "thinkpad", "chromebook"],
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
};

const TEMPLATES: Template[] = [
  LAPTOP,
  PHONE,
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
    keys: ["camera", "canon", "nikon", "lens"],
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
];

const FURNITURE = TEMPLATES.find((t) => t.title.includes("Furniture"))!;

type Pix = {
  wood: number;
  dark: number;
  bright: number;
  green: number;
  skin: number;
  n: number;
  varSum: number;
  lumSum: number;
};

function addPixel(s: Pix, r: number, g: number, b: number) {
  const lum = (r + g + b) / 3;
  s.n++;
  s.lumSum += lum;
  s.varSum += lum * lum;
  if (lum < 72) s.dark++;
  if (lum > 205) s.bright++;
  if (r > 90 && r > g && g >= b - 14 && r - b > 22 && lum > 50 && lum < 205) s.wood++;
  if (g > r + 18 && g > b + 10 && lum > 40) s.green++;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15 && max - min > 15 && lum < 220) s.skin++;
}

function emptyPix(): Pix {
  return { wood: 0, dark: 0, bright: 0, green: 0, skin: 0, n: 0, varSum: 0, lumSum: 0 };
}

function ratio(part: number, n: number) {
  return n ? part / n : 0;
}

function lumVar(s: Pix) {
  if (s.n < 2) return 0;
  const mean = s.lumSum / s.n;
  return s.varSum / s.n - mean * mean;
}

function sampleRect(data: Uint8ClampedArray, W: number, x0: number, y0: number, w: number, h: number, step: number) {
  const s = emptyPix();
  const x1 = x0 + w;
  const y1 = y0 + h;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const i = (y * W + x) * 4;
      addPixel(s, data[i], data[i + 1], data[i + 2]);
    }
  }
  return s;
}

async function inspectPixels(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    const max = 240;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const W = Math.max(24, Math.round(img.naturalWidth * scale));
    const H = Math.max(24, Math.round(img.naturalHeight * scale));
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, W, H);
    const { data } = ctx.getImageData(0, 0, W, H);
    const step = 3;
    const full = sampleRect(data, W, 0, 0, W, H, step);
    const cx = Math.floor(W * 0.22);
    const cy = Math.floor(H * 0.16);
    const cw = Math.max(8, Math.floor(W * 0.56));
    const ch = Math.max(8, Math.floor(H * 0.68));
    const center = sampleRect(data, W, cx, cy, cw, ch, step);
    return {
      aspect: img.naturalWidth / img.naturalHeight,
      portrait: img.naturalHeight / img.naturalWidth > 1.05,
      centerDark: ratio(center.dark, center.n),
      centerWood: ratio(center.wood, center.n),
      centerBright: ratio(center.bright, center.n),
      centerSkin: ratio(center.skin, center.n),
      fullWood: ratio(full.wood, full.n),
      fullGreen: ratio(full.green, full.n),
      centerVar: lumVar(center),
      ringWood: Math.max(0, ratio(full.wood, full.n) - ratio(center.wood, center.n) * 0.35),
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

function nameHit(file: File): Template | null {
  const name = file.name.toLowerCase();
  return TEMPLATES.find((t) => t.keys.some((k) => name.includes(k))) ?? null;
}

function pickFromPixels(vis: NonNullable<Awaited<ReturnType<typeof inspectPixels>>>, named: Template | null): Template {
  if (named && named !== FURNITURE) return named;

  const phoneOnTable =
    vis.centerWood < 0.32 &&
    vis.centerSkin < 0.22 &&
    (vis.ringWood > 0.1 || vis.fullWood > 0.16) &&
    (vis.centerDark > 0.18 || vis.centerVar > 900 || vis.centerBright > 0.06);

  const darkHandset = vis.centerDark > 0.26 && vis.centerWood < 0.28 && vis.centerSkin < 0.2;
  const litScreen = vis.centerVar > 1200 && vis.centerWood < 0.3 && vis.centerSkin < 0.25;

  if (named === FURNITURE && !(phoneOnTable || darkHandset || litScreen)) {
    return FURNITURE;
  }

  if (phoneOnTable || darkHandset || litScreen || vis.portrait) {
    if (vis.aspect > 1.25 && vis.centerDark > 0.2) return LAPTOP;
    return PHONE;
  }

  if (vis.centerWood > 0.52 && vis.centerDark < 0.14 && vis.fullWood > 0.42 && vis.centerVar < 700) {
    return FURNITURE;
  }

  return PHONE;
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
      reason: "EcoLoop does not list living things, people, pets, or unclear/weird photos. Photograph the object only.",
      reasonMy: "သက်ရှိ၊ လူ၊ pets သို့မဟုတ် ပုံဆန်းများ တင်၍မရပါ။ ပစ္စည်းကိုသာ ရိုက်ပါ။",
    };
  }

  let vis: Awaited<ReturnType<typeof inspectPixels>> = null;
  try {
    vis = await inspectPixels(file);
  } catch {
    vis = null;
  }

  if (!vis) {
    return {
      ok: false,
      reason: "Could not read this image. Try another photo of the object.",
      reasonMy: "ဤပုံကို ဖတ်မရပါ။ ပစ္စည်းကို ထပ်ရိုက်ပါ။",
    };
  }

  const named = nameHit(file);

  if (vis.centerSkin > 0.34 && vis.centerDark < 0.12) {
    return {
      ok: false,
      reason: "This looks like a person or selfie, not a product. Photograph the item only.",
      reasonMy: "Selfie/လူပုံ နှင့် တူသည်။ ပစ္စည်းကိုသာ ရိုက်ပါ။",
    };
  }
  if (vis.fullGreen > 0.48) {
    return {
      ok: false,
      reason: "This looks like a living plant or outdoor scene, not a listable object.",
      reasonMy: "အပင်/ပြင်ပ မြင်ကွင်း နှင့် တူသည်။ ပစ္စည်းကိုသာ ရိုက်ပါ။",
    };
  }

  const tmpl = pickFromPixels(vis, named);
  const price = Math.max(tmpl.priceMin, Math.min(tmpl.priceMax, tmpl.price));
  return {
    ok: true,
    ...tmpl,
    price,
    conditionScore: tmpl.conditionScore,
  };
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

/** Same scanner as inspectListingPhoto (keeps older import names compiling). */
export const classifyProductImage = inspectListingPhoto;

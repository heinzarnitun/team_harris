import { supabase } from "./supabaseClient";
import type { ChatMessage, ChatThread, Product, ProductDefect, TradingMode } from "./types";

export type Profile = {
  id: string;
  name: string;
  email: string;
  trust_score: number;
  verified: boolean;
  avatar_url: string | null;
};

type ProductRow = {
  id: string;
  user_id: string;
  title: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string | null;
  distance: string | null;
  location: string | null;
  ai_condition_score: number | null;
  ai_condition_label: string | null;
  co2_saved_kg: number | null;
  defects: ProductDefect[] | null;
  trading_type: "sale" | "barter" | "free";
  gallery: string[] | null;
  status: "active" | "sold" | "hidden" | null;
  meta: Record<string, unknown> | null;
  profiles: Profile | Profile[] | null;
};

function throwDb(error: { message?: string; details?: string; hint?: string; code?: string } | null) {
  if (!error) return;
  const msg = [error.message, error.details, error.hint, error.code].filter(Boolean).join(" — ");
  throw new Error(msg || "Database request failed");
}

function one<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

export function mapProduct(row: ProductRow): Product {
  const seller = one(row.profiles);
  const meta = row.meta ?? {};
  const score = row.ai_condition_score ?? 80;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    price: Number(row.price),
    originalPrice: Number(row.original_price ?? row.price),
    marketAverage: Number(meta.marketAverage ?? row.original_price ?? row.price),
    category: row.category as Product["category"],
    image: row.image_url ?? "",
    distance: row.distance ?? "",
    location: row.location ?? "",
    aiConditionScore: score,
    aiConditionLabel: row.ai_condition_label ?? "Good",
    co2SavedKg: Number(row.co2_saved_kg ?? 0),
    eWastePreventedKg: Number(meta.eWastePreventedKg ?? 0),
    defects: row.defects ?? [],
    seller: {
      name: seller?.name ?? "EcoLoop seller",
      avatar: seller?.avatar_url ?? "",
      trustScore: seller?.trust_score ?? 80,
      verified: seller?.verified ?? false,
      responseRate: "< 15 mins",
    },
    aiVerified: Boolean(meta.aiVerified ?? score >= 85),
    barterAvailable: row.trading_type !== "sale",
    description: String(meta.description ?? ""),
    descriptionMy: String(meta.descriptionMy ?? ""),
    tradingType: row.trading_type,
    images: Array.from(
      new Set(
        [row.image_url, ...((row.gallery as string[] | null) ?? []), ...((meta.images as string[] | undefined) ?? [])].filter(
          (u): u is string => Boolean(u),
        ),
      ),
    ),
    status: row.status === "sold" || row.status === "hidden" ? row.status : "active",
  };
}

export async function getSessionProfile(): Promise<Profile | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
  if (profile) return profile as Profile;
  return {
    id: data.user.id,
    name: (data.user.user_metadata?.name as string) || data.user.email?.split("@")[0] || "Member",
    email: data.user.email ?? "",
    trust_score: 80,
    verified: false,
    avatar_url: (data.user.user_metadata?.avatar_url as string) ?? null,
  };
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throwDb(error);
  return data.user;
}

export async function registerUser(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throwDb(error);
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      name,
      email,
      trust_score: 80,
      verified: false,
    });
  }
  return data.user;
}

export async function logoutUser() {
  await supabase.auth.signOut();
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });
  if (error) throwDb(error);
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function createProduct(input: {
  title: string;
  price: number;
  originalPrice: number;
  category: string;
  imageUrl: string;
  distance: string;
  location: string;
  aiConditionScore: number;
  aiConditionLabel: string;
  co2SavedKg: number;
  defects: ProductDefect[];
  tradingMode: TradingMode;
  description: string;
  descriptionMy: string;
  userId: string;
  gallery?: string[];
}): Promise<Product> {
  const trading_type =
    input.tradingMode === "giveaway" ? "free" : input.tradingMode === "barter" ? "barter" : "sale";
  const extras = (input.gallery ?? []).filter((u) => u && u !== input.imageUrl);
  const row = {
    id: `p-${Date.now()}`,
    user_id: input.userId,
    title: input.title,
    price: input.price,
    original_price: input.originalPrice,
    category: input.category,
    image_url: input.imageUrl,
    distance: input.distance,
    location: input.location,
    ai_condition_score: input.aiConditionScore,
    ai_condition_label: input.aiConditionLabel,
    co2_saved_kg: input.co2SavedKg,
    defects: input.defects,
    trading_type,
    gallery: extras,
    status: "active",
    meta: {
      marketAverage: input.price,
      eWastePreventedKg: 2.4,
      description: input.description,
      descriptionMy: input.descriptionMy,
      aiVerified: true,
      images: extras,
    },
  };
  const { data, error } = await supabase.from("products").insert(row).select("*, profiles(*)").single();
  if (error) throwDb(error);
  return mapProduct(data as ProductRow);
}

export async function getChats(userId: string): Promise<ChatThread[]> {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throwDb(error);

  const threads: ChatThread[] = [];
  for (const c of chats ?? []) {
    const otherId = c.buyer_id === userId ? c.seller_id : c.buyer_id;
    const [{ data: other }, { data: msgs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", otherId).maybeSingle(),
      supabase.from("messages").select("*").eq("chat_id", c.id).order("created_at", { ascending: true }),
    ]);
    const lastOffer = [...(msgs ?? [])].reverse().find((m: { offer_amount: number | null }) => m.offer_amount != null);
    threads.push({
      id: c.id,
      productId: c.product_id,
      otherParty: {
        name: other?.name ?? "Member",
        avatar: other?.avatar_url ?? "",
        role: c.buyer_id === userId ? "seller" : "buyer",
      },
      unread: 0,
      activeOffer: lastOffer?.offer_amount != null ? Number(lastOffer.offer_amount) : null,
      messages: (msgs ?? []).map(
        (m: { id: string; sender_id: string; text: string; created_at: string; offer_amount: number | null }): ChatMessage => ({
          id: m.id,
          sender: m.sender_id === userId ? "buyer" : "seller",
          text: m.text,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          offerAmount: m.offer_amount != null ? Number(m.offer_amount) : undefined,
        }),
      ),
    });
  }
  return threads;
}

export async function startChat(productId: string, buyerId: string, sellerId: string) {
  if (buyerId === sellerId) throw new Error("own-listing");
  const { data: existing } = await supabase
    .from("chats")
    .select("id")
    .eq("product_id", productId)
    .eq("buyer_id", buyerId)
    .maybeSingle();
  if (existing) return existing.id as string;
  const { data, error } = await supabase
    .from("chats")
    .insert({ product_id: productId, buyer_id: buyerId, seller_id: sellerId })
    .select("id")
    .single();
  if (error) throwDb(error);
  if (!data) throw new Error("Could not start chat");
  return data.id as string;
}

export async function sendChatMessage(chatId: string, senderId: string, text: string, offerAmount?: number) {
  const { error } = await supabase.from("messages").insert({
    chat_id: chatId,
    sender_id: senderId,
    text,
    offer_amount: offerAmount ?? null,
  });
  if (error) throwDb(error);
}

export async function updateProduct(
  id: string,
  patch: {
    title?: string;
    price?: number;
    gallery?: string[];
    status?: "active" | "sold" | "hidden";
  },
) {
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throwDb(error);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throwDb(error);
}

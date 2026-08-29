export type CategoryName =
  | "All"
  | "⚡ Electronics"
  | "👗 Fashion"
  | "📚 Books"
  | "🔄 Barter/Swap"
  | "🌱 Eco-Deals";

export type DefectSeverity = "minor" | "moderate" | "major";

export interface ProductDefect {
  x: number;
  y: number;
  label: string;
  severity: DefectSeverity;
}

export interface Seller {
  name: string;
  avatar: string;
  trustScore: number;
  verified: boolean;
  responseRate: string;
}

export interface Product {
  id: string;
  userId?: string;
  tradingType?: "sale" | "barter" | "free";
  title: string;
  price: number;
  originalPrice: number;
  marketAverage: number;
  category: Exclude<CategoryName, "All">;
  image: string;
  distance: string;
  location: string;
  aiConditionScore: number;
  aiConditionLabel: string;
  co2SavedKg: number;
  eWastePreventedKg: number;
  defects: ProductDefect[];
  seller: Seller;
  aiVerified: boolean;
  barterAvailable: boolean;
  description: string;
  descriptionMy: string;
  images?: string[];
  status?: "active" | "sold" | "hidden";
}

export type ChatSender = "buyer" | "seller" | "system";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: string;
  offerAmount?: number;
}

export interface ChatThread {
  id: string;
  productId: string;
  otherParty: {
    name: string;
    avatar: string;
    role: "buyer" | "seller";
  };
  unread: number;
  activeOffer: number | null;
  messages: ChatMessage[];
}

export type TradingMode = "direct" | "barter" | "giveaway";

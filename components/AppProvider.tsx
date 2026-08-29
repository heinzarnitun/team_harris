"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_CHATS, MOCK_LOCATIONS, MOCK_PRODUCTS } from "@/lib/mockData";
import type { CategoryName, ChatThread, Product } from "@/lib/types";

interface AppContextValue {
  products: Product[];
  chats: ChatThread[];
  selectedCategory: CategoryName;
  setSelectedCategory: (c: CategoryName) => void;
  aiVerifiedOnly: boolean;
  setAiVerifiedOnly: (v: boolean) => void;
  barterOnly: boolean;
  setBarterOnly: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  location: string;
  setLocation: (l: string) => void;
  sellModalOpen: boolean;
  setSellModalOpen: (open: boolean) => void;
  addProduct: (product: Product) => void;
  addChatMessage: (threadId: string, text: string, offerAmount?: number) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("All");
  const [aiVerifiedOnly, setAiVerifiedOnly] = useState(false);
  const [barterOnly, setBarterOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(MOCK_LOCATIONS[0]);
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const addChatMessage = useCallback(
    (threadId: string, text: string, offerAmount?: number) => {
      setChats((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            unread: 0,
            activeOffer: offerAmount ?? thread.activeOffer,
            messages: [
              ...thread.messages,
              {
                id: `m-${Date.now()}`,
                sender: "buyer" as const,
                text,
                timestamp: "Just now",
                offerAmount,
              },
            ],
          };
        }),
      );
    },
    [],
  );

  const unreadCount = useMemo(
    () => chats.reduce((sum, t) => sum + t.unread, 0),
    [chats],
  );

  const value = useMemo(
    () => ({
      products,
      chats,
      selectedCategory,
      setSelectedCategory,
      aiVerifiedOnly,
      setAiVerifiedOnly,
      barterOnly,
      setBarterOnly,
      searchQuery,
      setSearchQuery,
      location,
      setLocation,
      sellModalOpen,
      setSellModalOpen,
      addProduct,
      addChatMessage,
      unreadCount,
    }),
    [
      products,
      chats,
      selectedCategory,
      aiVerifiedOnly,
      barterOnly,
      searchQuery,
      location,
      sellModalOpen,
      addProduct,
      addChatMessage,
      unreadCount,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function filterProducts(
  products: Product[],
  opts: {
    category: CategoryName;
    aiVerifiedOnly: boolean;
    barterOnly: boolean;
    query: string;
  },
) {
  const q = opts.query.trim().toLowerCase();
  return products.filter((p) => {
    if (opts.category !== "All" && p.category !== opts.category) return false;
    if (opts.aiVerifiedOnly && !p.aiVerified) return false;
    if (opts.barterOnly && !p.barterAvailable) return false;
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });
}

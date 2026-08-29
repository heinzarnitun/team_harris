"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_CHATS, MOCK_LOCATIONS } from "@/lib/mockData";
import type { Lang } from "@/lib/i18n";
import type { CategoryName, ChatThread, Product } from "@/lib/types";
import { aiMatchProduct, parseAiQuery } from "@/lib/search";
import {
  createProduct,
  getChats,
  getProducts,
  getSessionProfile,
  loginUser,
  logoutUser,
  registerUser,
  sendChatMessage,
  startChat,
  type Profile,
} from "@/lib/supabase";
import { supabase } from "@/lib/supabaseClient";

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
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  user: Profile | null;
  lang: Lang;
  setLang: (l: Lang) => void;
  addProduct: (product: Omit<Parameters<typeof createProduct>[0], "userId">) => Promise<void>;
  addChatMessage: (threadId: string, text: string, offerAmount?: number) => Promise<void>;
  openChatWithSeller: (product: Product) => Promise<string | null>;
  refreshChats: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requireAuth: () => boolean;
  unreadCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("All");
  const [aiVerifiedOnly, setAiVerifiedOnly] = useState(false);
  const [barterOnly, setBarterOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(MOCK_LOCATIONS[0]);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  const refreshChats = useCallback(async () => {
    if (!user) {
      setChats([]);
      return;
    }
    try {
      setChats(await getChats(user.id));
    } catch {
      setChats([]);
    }
  }, [user]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        queueMicrotask(() => setUser(null));
        return;
      }
      void getSessionProfile().then((profile) => setUser(profile));
    });
    void getProducts()
      .then((rows) => setProducts(rows))
      .catch(() => undefined);
    void getSessionProfile().then((profile) => setUser(profile));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setChats([]));
      return;
    }
    void getChats(user.id)
      .then((rows) => setChats(rows))
      .catch(() => setChats([]));
  }, [user]);

  const requireAuth = useCallback(() => {
    if (user) return true;
    setAuthOpen(true);
    return false;
  }, [user]);

  const addProduct = useCallback(
    async (product: Omit<Parameters<typeof createProduct>[0], "userId">) => {
      if (!user) throw new Error("Not signed in");
      const created = await createProduct({ ...product, userId: user.id });
      setProducts((prev) => [created, ...prev]);
    },
    [user],
  );

  const addChatMessage = useCallback(
    async (threadId: string, text: string, offerAmount?: number) => {
      if (!user) return;
      await sendChatMessage(threadId, user.id, text, offerAmount);
      await refreshChats();
    },
    [user, refreshChats],
  );

  const openChatWithSeller = useCallback(
    async (product: Product) => {
      if (!user || !product.userId) return null;
      const id = await startChat(product.id, user.id, product.userId);
      await refreshChats();
      return id;
    },
    [user, refreshChats],
  );

  const login = useCallback(async (email: string, password: string) => {
    await loginUser(email, password);
    setUser(await getSessionProfile());
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await registerUser(name, email, password);
    setUser(await getSessionProfile());
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setChats([]);
  }, []);

  const unreadCount = useMemo(() => chats.reduce((sum, c) => sum + c.unread, 0), [chats]);

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
      authOpen,
      setAuthOpen,
      user,
      lang,
      setLang,
      addProduct,
      addChatMessage,
      openChatWithSeller,
      refreshChats,
      login,
      register,
      logout,
      requireAuth,
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
      authOpen,
      user,
      lang,
      addProduct,
      addChatMessage,
      openChatWithSeller,
      refreshChats,
      login,
      register,
      logout,
      requireAuth,
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
  const q = opts.query.trim();
  const parsed = q ? parseAiQuery(q) : null;
  return products.filter((p) => {
    if (opts.category !== "All" && p.category !== opts.category) return false;
    if (opts.aiVerifiedOnly && !p.aiVerified) return false;
    if (opts.barterOnly && !p.barterAvailable) return false;
    if (!parsed) return true;
    return aiMatchProduct(p, parsed);
  });
}

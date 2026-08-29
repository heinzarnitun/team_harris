import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://cjccjeiynvtaupymzuzp.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqY2NqZWl5bnZ0YXVweW16dXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODk3NTIsImV4cCI6MjEwMzQ2NTc1Mn0.hJzaAkPK5g7lU-nsLymK2tDM8mU7cDP_a82Nt829JxA";

/** Browser talks to this app (`/supabase`); the server talks to Supabase directly. */
function clientUrl() {
  if (typeof window === "undefined") return SUPABASE_URL;
  return `${window.location.origin}/supabase`;
}

export const supabase = createClient(clientUrl(), SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const DEMO_LOGIN = {
  email: "seller1@ecoloop.com",
  password: "password123",
} as const;

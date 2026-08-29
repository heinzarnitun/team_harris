import { createClient } from "@supabase/supabase-js";

/** Public project URL + anon key (safe for the browser). Service role is never bundled. */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://cjccjeiynvtaupymzuzp.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqY2NqZWl5bnZ0YXVweW16dXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODk3NTIsImV4cCI6MjEwMzQ2NTc1Mn0.hJzaAkPK5g7lU-nsLymK2tDM8mU7cDP_a82Nt829JxA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const DEMO_LOGIN = {
  email: "seller1@ecoloop.com",
  password: "password123",
} as const;

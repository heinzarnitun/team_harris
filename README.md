# EcoLoop

AI-powered local second-hand marketplace for Yangon-area circular shopping: buy, sell, barter, and message sellers in kyat.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide, Supabase (Auth + Postgres + RLS).

Listings, chats, offers, and seller accounts persist in Supabase. The browser talks to the same origin (`/supabase`) so the hosted preview is not blocked by CORS.

## Demo login

Password for all demo sellers: `password123`

| Email | Seller |
| --- | --- |
| `seller1@ecoloop.com` | Kyaw Kyaw |
| `seller2@ecoloop.com` | Su Su |
| `seller3@ecoloop.com` | Min Min |
| `seller4@ecoloop.com` | Aye Aye |
| `seller5@ecoloop.com` | Ko Ko |

Registering a new email/password also works (confirmation mail is off on the demo project).

## What works now

- **Discovery feed** — live catalog in Ks (`1 USD = 3600 Ks`), categories, AI-verified / barter filters, English + မြန်မာ UI (industry terms stay English).
- **Natural-language search** — e.g. `phones under 400000 Ks`, compact desk, barter.
- **Product pages** — condition score, defect pins, extra gallery photos, negotiate / swap.
- **Snap to List** — photo upload, object check (center of the frame so a phone on a table is not labeled furniture), fair Ks range, EN/MY description, extra angles. Living subjects are blocked.
- **My listings** (profile) — edit under the card, mark sold out, relist, delete.
- **Messages** — seller threads, Make Offer, Deal Copilot chips.
- **EcoLoop Guide** (first thread in Messages) — ask what to buy/sell, what’s moving nearby, and price bands. Matching listings are tappable cards (open the product or message the seller).

## Run locally

```bash
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route | Page |
| --- | --- |
| `/` | Neighborhood feed |
| `/search` | AI search |
| `/product/[id]` | Listing |
| `/chat` | Guide + deal chats |
| `/profile` | Account + my listings |

Schema: `supabase/schema.sql` (`profiles`, `products` including `gallery` + `status`, `chats`, `messages`, RLS, `handle_new_user`).

Use the **anon** key in the Next.js client. Do not put the service role key in the browser.

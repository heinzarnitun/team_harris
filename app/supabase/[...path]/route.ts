import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL } from "@/lib/supabaseClient";

const HOP = new Set(["connection", "keep-alive", "transfer-encoding", "host", "content-length"]);

async function proxy(req: NextRequest, path: string[]) {
  const target = new URL(`${SUPABASE_URL}/${path.join("/")}`);
  target.search = new URL(req.url).search;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP.has(key.toLowerCase()) && key.toLowerCase() !== "accept-encoding") {
      headers.set(key, value);
    }
  });
  headers.set("host", new URL(SUPABASE_URL).host);

  const init: RequestInit = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const skipOut = new Set(["transfer-encoding", "content-encoding", "content-length", "set-cookie"]);
  const buf = await upstream.arrayBuffer();
  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    if (skipOut.has(key.toLowerCase())) return;
    out.set(key, value);
  });
  return new NextResponse(buf, { status: upstream.status, headers: out });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function OPTIONS(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}

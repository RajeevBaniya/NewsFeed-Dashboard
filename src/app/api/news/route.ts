import { NextRequest, NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;

// In-memory cache and simple rate limiter (per process)
type CacheEntry = { data: unknown; expiresAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __newsCache: Map<string, CacheEntry> | undefined;
}

const cache: Map<string, CacheEntry> = globalThis.__newsCache ?? new Map<string, CacheEntry>();
globalThis.__newsCache = cache;

let lastRequestTs = 0;

export async function GET(req: NextRequest) {
  if (!NEWS_API_KEY) {
    return NextResponse.json({ error: 'NEWS_API_KEY missing' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'technology';
  const page = parseInt(searchParams.get('page') || '1', 10) || 1;

  // Rate limit: at most one upstream request per 2000ms
  const now = Date.now();
  if (now - lastRequestTs < 2000) {
    // serve from cache if possible, else wait minimally
    const key = `top-${category}-${page}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data, { status: 200 });
    }
    await new Promise((r) => setTimeout(r, 2000 - (now - lastRequestTs)));
  }

  const key = `top-${category}-${page}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, { status: 200 });
  }

  const url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(
    category
  )}&country=us&page=${page}&pageSize=20&apiKey=${NEWS_API_KEY}`;

  const resp = await fetch(url, { cache: 'no-store' });
  lastRequestTs = Date.now();

  if (!resp.ok) {
    // On 426/429 propagate status so client circuit breaker can react
    return NextResponse.json({ error: `upstream ${resp.status}` }, { status: resp.status });
  }

  const data = await resp.json();
  // Cache 10 minutes
  cache.set(key, { data, expiresAt: Date.now() + 10 * 60 * 1000 });
  return NextResponse.json(data, { status: 200 });
}



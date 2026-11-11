import { getErrorMessage } from './errors';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();
const MAX_BUCKETS = 5000;

/**
 * Upstash Redis / Vercel KV (REST) — ixtiyoriy.
 *
 * MUHIM: Vercel kabi serverless muhitda jarayon xotirasidagi `Map` har bir
 * instansda alohida bo'ladi, shuning uchun limit amalda ishlamaydi. Redis
 * sozlangan bo'lsa, limit global va ishonchli bo'ladi.
 */
const REDIS_URL = (
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL ||
  ''
).replace(/\/+$/, '');
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';

function hasRedis(): boolean {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

function pruneExpired(now: number) {
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
  // Map cheksiz o'smasligi uchun eng eski yozuvlarni ham tozalaymiz.
  if (buckets.size > MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++removed >= excess) break;
    }
  }
}

function checkInMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/**
 * Redis pipeline: INCR + PEXPIRE NX (kalit birinchi marta yaratilganda TTL).
 * Xato bo'lsa `null` qaytaradi — chaqiruvchi in-memory rejimga tushadi.
 */
async function checkWithRedis(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult | null> {
  try {
    const response = await fetch(`${REDIS_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['PEXPIRE', key, windowMs, 'NX'],
      ]),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn(`Rate limit Redis xatosi: HTTP ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as Array<{ result?: unknown; error?: string }>;
    const count = Number(payload?.[0]?.result);

    if (!Number.isFinite(count)) {
      return null;
    }

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt: Date.now() + windowMs,
    };
  } catch (error: unknown) {
    console.warn('Rate limit Redis bilan aloqa yo`q:', getErrorMessage(error));
    return null;
  }
}

/**
 * Limitni tekshirish.
 *
 * Redis sozlangan bo'lsa — global limit, aks holda jarayon xotirasi (faqat
 * lokal dev / bitta instans uchun ishonchli).
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (!Number.isFinite(limit) || limit <= 0 || !Number.isFinite(windowMs) || windowMs <= 0) {
    return { allowed: true, remaining: 0, resetAt: Date.now() };
  }

  if (hasRedis()) {
    const redisResult = await checkWithRedis(key, limit, windowMs);
    if (redisResult) return redisResult;
    // Redis yiqilsa — mavjudlikni saqlash uchun in-memory'ga tushamiz.
  }

  return checkInMemory(key, limit, windowMs);
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }
  return 'unknown';
}

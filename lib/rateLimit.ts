type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();
const MAX_BUCKETS = 5000;

function pruneExpired(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
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

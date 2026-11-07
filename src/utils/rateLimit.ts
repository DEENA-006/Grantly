// Lightweight in-memory sliding-window rate limiter per SHIELD protocol
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  ip: string = "anonymous",
  limit: number = 60,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = ipMap.get(ip);

  // Clean old expired records periodically
  if (ipMap.size > 1000) {
    for (const [key, value] of ipMap.entries()) {
      if (value.resetAt < now) {
        ipMap.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    const newRecord: RateLimitRecord = { count: 1, resetAt: now + windowMs };
    ipMap.set(ip, newRecord);
    return { success: true, remaining: limit - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}


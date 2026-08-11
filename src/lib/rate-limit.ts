import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  if (!redis) return { success: true, remaining: limit, reset: Date.now() + windowMs, limit };
  
  const now = Date.now();
  const windowSec = Math.ceil(windowMs / 1000);
  const redisKey = `rl:${key}:${Math.floor(now / windowMs)}`;
  
  const current = await redis.incr(redisKey);
  if (current === 1) await redis.expire(redisKey, windowSec);
  
  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
    reset: (Math.floor(now / windowMs) + 1) * windowMs,
    limit,
  };
}

export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  action: T, getKey: (...args: Parameters<T>) => string, limit: number, windowMs: number
): T {
  return (async (...args) => {
    const key = getKey(...args);
    const result = await rateLimit(key, limit, windowMs);
    if (!result.success) throw new Error(`RATE_LIMIT_EXCEEDED:${result.reset}`);
    return action(...args);
  }) as T;
}

export const RATE_LIMITS = {
  register: { limit: 3, windowMs: 60 * 60 * 1000 },
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  resetRequest: { limit: 2, windowMs: 60 * 60 * 1000 },
  verifyEmail: { limit: 10, windowMs: 60 * 60 * 1000 },
  newsletterSubscribe: { limit: 3, windowMs: 60 * 60 * 1000 },
  applyDiscount: { limit: 10, windowMs: 60 * 1000 },
  createOrder: { limit: 5, windowMs: 60 * 1000 },
} as const;

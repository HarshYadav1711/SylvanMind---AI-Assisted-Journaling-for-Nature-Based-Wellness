import { createHash } from "crypto";
import { createClient, RedisClientType } from "redis";

export interface CachedAnalysis {
  emotion: string;
  keywords: string[];
  summary: string;
}

const CACHE_PREFIX = "sylvanmind:analysis:";
const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (client?.isOpen) return client;
  try {
    client = createClient({ url });
    client.on("error", (err) => console.error("Redis error:", err));
    await client.connect();
    return client;
  } catch (err) {
    console.warn("Redis unavailable, analysis cache disabled:", err);
    return null;
  }
}

export function analysisCacheKey(text: string): string {
  return CACHE_PREFIX + createHash("sha256").update(text.trim()).digest("hex");
}

export async function getCachedAnalysis(key: string): Promise<CachedAnalysis | null> {
  const redis = await getRedisClient();
  if (!redis) return null;
  const raw = await redis.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedAnalysis;
  } catch {
    return null;
  }
}

export async function setCachedAnalysis(key: string, value: CachedAnalysis): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;
  await redis.setEx(key, CACHE_TTL_SECONDS, JSON.stringify(value));
}

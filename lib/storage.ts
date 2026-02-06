/**
 * Storage abstraction — works on both local dev (fs) and Vercel (Upstash Redis).
 *
 * Setup for Vercel:
 * 1. Go to Vercel Dashboard → your project → Storage → Create → Upstash Redis
 * 2. Connect it to your project — env vars are auto-set (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
 * 3. Redeploy
 *
 * Without Redis configured, falls back to /tmp on Vercel (ephemeral but functional).
 * Locally always uses filesystem in data/*.json.
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const IS_VERCEL = process.env.VERCEL === '1';

// ─── Redis client (lazy init) ────────────────────────────

let redisClient: import('@upstash/redis').Redis | null | undefined;

async function getRedis() {
  if (redisClient !== undefined) return redisClient;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const { Redis } = await import('@upstash/redis');
      redisClient = new Redis({ url, token });
      return redisClient;
    } catch {
      redisClient = null;
      return null;
    }
  }

  redisClient = null;
  return null;
}

// ─── Filesystem helpers ──────────────────────────────────

function fsPath(key: string): string {
  if (IS_VERCEL) {
    // On Vercel, /tmp is writable; seed from bundled data if not present
    const tmpPath = path.join('/tmp', `${key}.json`);
    if (!fs.existsSync(tmpPath)) {
      try {
        const srcPath = path.join(DATA_DIR, `${key}.json`);
        const data = fs.readFileSync(srcPath, 'utf-8');
        fs.writeFileSync(tmpPath, data);
      } catch {
        fs.writeFileSync(tmpPath, '[]');
      }
    }
    return tmpPath;
  }
  return path.join(DATA_DIR, `${key}.json`);
}

function fsRead<T>(key: string): T[] {
  try {
    const raw = fs.readFileSync(fsPath(key), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function fsWrite<T>(key: string, data: T[]): void {
  fs.writeFileSync(fsPath(key), JSON.stringify(data, null, 2));
}

// ─── Public API ──────────────────────────────────────────

export async function getData<T>(key: string): Promise<T[]> {
  const redis = await getRedis();

  if (redis) {
    try {
      const data = await redis.get<T[]>(key);
      if (data !== null && data !== undefined) return data;

      // First access — seed Redis from bundled JSON
      const initial = fsRead<T>(key);
      if (initial.length > 0) {
        await redis.set(key, initial);
      }
      return initial;
    } catch (err) {
      console.error(`Redis read failed for "${key}", falling back to fs:`, err);
    }
  }

  return fsRead<T>(key);
}

export async function setData<T>(key: string, data: T[]): Promise<void> {
  const redis = await getRedis();

  if (redis) {
    try {
      await redis.set(key, data);
      return;
    } catch (err) {
      console.error(`Redis write failed for "${key}", falling back to fs:`, err);
    }
  }

  fsWrite(key, data);
}

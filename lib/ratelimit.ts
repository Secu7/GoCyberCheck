// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// IP 기준: 5회/분
export const rateByIP = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
});

// 이메일 기준: 3회/시간
export const rateByEmail = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
});

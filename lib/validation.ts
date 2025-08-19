// lib/validation.ts
import { z } from 'zod';

export const Answer = z.object({ key: z.string(), value: z.enum(['yes','no','unknown']) });
export const SubmitPayload = z.object({
  email: z.string().email(),
  answers: z.array(Answer).min(10).max(20)
});

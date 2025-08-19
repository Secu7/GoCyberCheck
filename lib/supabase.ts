// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const sbAdmin = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only usage
    { auth: { persistSession: false } }
  );
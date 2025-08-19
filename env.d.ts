// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL: string;

    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    BREVO_API_KEY: string;
    BREVO_SENDER_EMAIL: string;
    BREVO_SENDER_NAME?: string;

    NEXT_PUBLIC_TURNSTILE_SITE_KEY: string; // public
    TURNSTILE_SECRET_KEY: string;           // server only

    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }
}
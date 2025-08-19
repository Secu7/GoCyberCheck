// lib/turnstile.ts
export async function verifyTurnstile(token: string, ip?: string) {
  if (!process.env.TURNSTILE_SECRET_KEY) return false;
  const params = new URLSearchParams();
  params.append('secret', process.env.TURNSTILE_SECRET_KEY);
  params.append('response', token);
  if (ip) params.append('remoteip', ip);

  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: params
  });
  if (!resp.ok) return false;
  const data = await resp.json().catch(()=>null);
  return !!data?.success;
}

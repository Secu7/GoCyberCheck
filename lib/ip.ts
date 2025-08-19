// lib/ip.ts
export function getClientIP(req: Request) {
  const h = (name: string) => (req.headers.get(name) || '').split(',')[0].trim();
  return h('x-forwarded-for') || h('x-real-ip') || '';
}

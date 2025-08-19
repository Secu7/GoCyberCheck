// lib/improvements.ts
import { IMP } from '@/data/improvements';

export function mapImprovements(noKeys: string[]) {
  const out = noKeys.map(k => IMP[k]).filter(Boolean);
  if (out.length === 0) return [
    'Enable 2FA on critical accounts',
    'Keep redundant backups',
    'Keep OS/browsers updated'
  ];
  return out.slice(0, 6);
}

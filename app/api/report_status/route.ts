// app/api/report_status/route.ts
import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(req: Request){
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok:false, error:'MISSING_ID' }, { status:400 });

  const { data, error } = await sbAdmin()
    .from('assessments')
    .select('id,email,created_at')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ ok:false, error:'NOT_FOUND' }, { status:404 });

  return NextResponse.json({ ok:true, id:data.id, email:data.email, created_at:data.created_at });
}

// app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { SubmitPayload } from '@/lib/validation';
import { sbAdmin } from '@/lib/supabase';
import { scoreChecklist } from '@/lib/scoring';
import { mapImprovements } from '@/lib/improvements';
import { verifyTurnstile } from '@/lib/turnstile';
import { getClientIP } from '@/lib/ip';
import { rateByIP, rateByEmail } from '@/lib/ratelimit';
import { z } from 'zod';           // ★ 추가


export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const required = [
      'SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY',
      'BREVO_API_KEY','BREVO_SENDER_EMAIL',
      'NEXT_PUBLIC_SITE_URL', 'TURNSTILE_SECRET_KEY',
      'UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN'
    ];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length) {
      return NextResponse.json({ error:'ENV_MISSING', detail:`Missing: ${missing.join(', ')}` }, { status:500 });
    }

    // --- 레이트리밋: IP ---
    const ip = getClientIP(req) || 'unknown';
    const ipRes = await rateByIP.limit(`submit:ip:${ip}`);
    if (!ipRes.success) {
      return NextResponse.json({ error:'RATE_LIMIT_IP', detail:'Too many requests. Please wait a minute.' }, { status:429 });
    }

    // 입력 파싱/검증
    const body = await req.json().catch(() => null);
    // 기존: const parsed = SubmitPayload.extend({ turnstileToken: (z)=>z.string().min(5) }).safeParse(body as any);
    // ↓ 아래 두 줄로 바꿔주세요
    const PayloadWithBot = SubmitPayload.extend({ turnstileToken: z.string().min(5) });
    const parsed = PayloadWithBot.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error:'INVALID_INPUT', issues: parsed.error.issues }, { status:400 });
    }
    const { email, answers, turnstileToken } = (parsed.data as any);

    // --- 레이트리밋: 이메일 ---
    const emRes = await rateByEmail.limit(`submit:email:${email}`);
    if (!emRes.success) {
      return NextResponse.json({ error:'RATE_LIMIT_EMAIL', detail:'Too many submissions for this email. Try again later.' }, { status:429 });
    }

    // --- Turnstile 검증 ---
    const ok = await verifyTurnstile(turnstileToken, ip);
    if (!ok) {
      return NextResponse.json({ error:'BOT_CHECK_FAILED', detail:'Bot verification failed.' }, { status:403 });
    }

    // 점수/요약
    const { score, grade, summary, noKeys } = scoreChecklist(answers);
    const improvements = mapImprovements(noKeys);

    // DB 저장
    const { data, error } = await sbAdmin()
      .from('assessments')
      .insert({ email, answers, score, grade, summary, improvements })
      .select('id')
      .single();
    if (error) throw new Error('DB_INSERT_FAILED: ' + (error.message || 'unknown'));

    const id = data.id as string;
    const site = process.env.NEXT_PUBLIC_SITE_URL!;

    // 이메일 발송 (이전 단계에서 사용한 payload 그대로)
    const emailPayload = {
      sender: { email: process.env.BREVO_SENDER_EMAIL!, name: process.env.BREVO_SENDER_NAME || 'GoCyberCheck' },
      to: [{ email }],
      subject: `[GoCyberCheck] Security Self-Check Result: ${grade} (${score})`,
      headers: { 'Content-Language': 'en' },
      htmlContent: `<!doctype html><html lang="en"><body style="font-family:Arial,Helvetica,sans-serif;">
        <p>Hello,</p>
        <p>Your GoCyberCheck security self-check result is ready.</p>
        <ul><li><b>Score:</b> ${score}</li><li><b>Grade:</b> ${grade}</li><li><b>Summary:</b> ${summary}</li></ul>
        <p><b>Open your result online:</b><br/><a href="${site}/results/${id}">${site}/results/${id}</a></p>
        <p><b>Download the PDF for this run:</b><br/><a href="${site}/api/report?id=${id}">Download PDF report</a></p>
        <hr/><p><b>Top recommended fixes</b></p>
        <ul>${(improvements as string[]).map(t=>`<li>${t}</li>`).join('')}</ul>
        <p style="color:#666;font-size:12px;margin-top:16px;">This email was sent by GoCyberCheck.</p>
      </body></html>`
    };
    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json', 'accept':'application/json' },
      body: JSON.stringify(emailPayload)
    });
    const text = await resp.text().catch(()=> '');
    if (!resp.ok) {
      return NextResponse.json({ error:'EMAIL_SEND_FAILED', detail:text || `status ${resp.status}` }, { status:502 });
    }

    return NextResponse.json({ id }, { status:201 });
  } catch (e:any) {
    console.error('[submit] fatal', e?.message || e);
    return NextResponse.json({ error:'SERVER_ERROR', detail:String(e?.message || e) }, { status:500 });
  }
}

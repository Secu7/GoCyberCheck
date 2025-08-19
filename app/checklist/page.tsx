// app/checklist/page.tsx
'use client';
import { useState } from 'react';
import Turnstile from 'react-turnstile';
import { QUESTIONS } from '@/data/questions';

type AnswerValue = 'yes' | 'no' | 'unknown';

export default function ChecklistPage(){
  const total = QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tsToken, setTsToken] = useState('');
  const [tsReady, setTsReady] = useState(false);

  const onChoose = (key: string, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(s => Math.min(s + 1, total));
  };

  const onSubmit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Enter a valid email.'); return; }
    if (!tsToken) { alert('Please complete the bot check.'); return; }
    setSubmitting(true);
    try {
      const payload = {
        email,
        answers: QUESTIONS.map(q => ({ key: q.key, value: answers[q.key] ?? 'unknown' })),
        turnstileToken: tsToken,
      };
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const t: any = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert('Submit failed: ' + (t.error || res.status) + (t.detail ? '\n\n' + t.detail : ''));
        setSubmitting(false);
        return;
      }
      const { id } = t;
      window.location.href = `/results/${id}`;
    } catch (e: any) {
      console.error('fetch failed', e);
      alert('Network error. Is the dev server running? Try again.');
      setSubmitting(false);
    }
  };

  const progress = Math.round((Math.min(step, total) / total) * 100);
  const q = QUESTIONS[step];

  return (
    <main className="max-w-xl mx-auto p-6">
      {/* progress */}
      <div className="h-2 bg-gray-200 rounded mb-6 overflow-hidden">
        <div className="h-full bg-black" style={{ width: `${progress}%` }} />
      </div>

      {step < total ? (
        <section>
          <p className="text-sm text-gray-500 mb-2">{step + 1} / {total}</p>
          <h2 className="text-lg font-semibold mb-4">{q.label}</h2>
          <div className="grid grid-cols-3 gap-3">
            {(['yes','no','unknown'] as const).map(v => (
              <button
                key={v}
                onClick={() => onChoose(q.key, v)}
                className="rounded-xl border px-4 py-3 hover:bg-gray-50"
              >
                {v==='yes' ? 'Yes' : v==='no' ? 'No' : 'Not sure'}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-lg font-semibold mb-2">Where should we send your report?</h2>
          <input
            className="w-full border rounded-xl px-4 py-3 mb-3"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          {/* Turnstile bot-check */}
          <div className="mb-3">
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => { setTsToken(token); setTsReady(true); }}
              onError={() => { setTsToken(''); setTsReady(false); }}
              onExpire={() => { setTsToken(''); setTsReady(false); }}
            />
          </div>

          <button
            disabled={submitting || !tsReady}
            onClick={onSubmit}
            className="rounded-xl px-5 py-3 bg-black text-white disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>

          <p className="text-xs text-gray-400 mt-3">
            Protected by Turnstile. This helps prevent bots.
          </p>
        </section>
      )}
    </main>
  );
}

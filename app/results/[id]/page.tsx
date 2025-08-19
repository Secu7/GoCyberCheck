// app/results/[id]/page.tsx
import { sbAdmin } from '@/lib/supabase';

type AnswerValue = 'yes' | 'no' | 'unknown';
type Answer = { key: string; value: AnswerValue };

export default async function ResultsPage({
  // ★ Next.js 15: params가 Promise 타입
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ★ Promise 해제

  const { data, error } = await sbAdmin()
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">Report not found</h1>
        <p className="text-gray-600">
          The requested report could not be found. Please try submitting again.
        </p>
      </main>
    );
  }

  const answers: Answer[] = Array.isArray(data.answers) ? (data.answers as Answer[]) : [];

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Your Security Report</h1>
      <p className="text-gray-600 mb-4">Email: {data.email}</p>

      <div className="rounded-xl border p-4 mb-6">
        <p>
          <b>Score:</b> {data.score} &nbsp; <b>Grade:</b> {data.grade}
        </p>
        <p>
          <b>Summary:</b> {data.summary}
        </p>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Top recommended fixes</h2>
        <ul className="list-disc pl-5 space-y-1">
          {Array.isArray(data.improvements) &&
            (data.improvements as string[]).map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your answers ({answers.length})</h2>
        <ul className="list-disc pl-5 space-y-1">
          {answers.map((a, i) => (
            <li key={i}>
              <b>{a.key}</b>: {a.value === 'yes' ? 'Yes' : a.value === 'no' ? 'No' : 'Not sure'}
            </li>
          ))}
        </ul>
      </section>

      <a
        href={`/api/report?id=${id}`}
        className="inline-block rounded-xl px-5 py-3 bg-black text-white"
      >
        Download PDF
      </a>
    </main>
  );
}

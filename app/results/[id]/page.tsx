// app/results/[id]/page.tsx
import { sbAdmin } from '@/lib/supabase';

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // DB에서 보고서 데이터 1건 조회
  const { data, error } = await sbAdmin()
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">Report not found</h1>
        <p className="text-gray-600">The requested report could not be found. Please try submitting again.</p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Your Security Report</h1>
      <p className="text-gray-600 mb-4">Email: {data.email}</p>

      <div className="rounded-xl border p-4 mb-6">
        <p><b>Score:</b> {data.score} &nbsp; <b>Grade:</b> {data.grade}</p>
        <p><b>Summary:</b> {data.summary}</p>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Top recommended fixes</h2>
        <ul className="list-disc pl-5 space-y-1">
          {Array.isArray(data.improvements) && data.improvements.map((t: string, i: number) => (
            <li key={i}>{t}</li>
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

// app/page.tsx
export default function Page(){
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-3">GoCyberCheck — 30-second Security Self-Check</h1>
        <p className="text-gray-600 mb-6">
          Answer 12 quick questions and get your score, grade, and top fixes by email.
        </p>
        <a href="/checklist" className="inline-block rounded-xl px-5 py-3 bg-black text-white">
          Start the check
        </a>
      </div>
    </main>
  );
}

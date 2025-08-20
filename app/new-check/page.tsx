import V0FormFields from "@/components/forms/V0FormFields";

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl py-10">
      <h1 className="text-2xl font-bold mb-6">PIPEDA Quick-Check</h1>

      <form
        method="POST"
        action="/api/submit"
        encType="multipart/form-data"
        className="space-y-6"
      >
        <V0FormFields />

        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-theme="auto"
        />

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

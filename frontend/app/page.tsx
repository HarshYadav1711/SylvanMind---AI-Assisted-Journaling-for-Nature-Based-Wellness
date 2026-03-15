import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-medium text-sage-800 sm:text-4xl">
        Journal with intention.
      </h1>
      <p className="mt-4 max-w-xl text-stone-600">
        A calm space to write, reflect, and understand your emotional landscape
        through nature-inspired prompts and gentle analysis.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/journal"
          className="inline-flex items-center justify-center rounded-lg bg-sage-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sage-700"
        >
          Open journal
        </Link>
        <Link
          href="/insights"
          className="inline-flex items-center justify-center rounded-lg border border-sage-300 bg-white px-5 py-2.5 text-sm font-medium text-sage-700 transition hover:bg-sage-50"
        >
          View insights
        </Link>
      </div>
    </main>
  );
}

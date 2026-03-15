import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">SylvanMind</h1>
      <p className="mt-2 text-gray-600">AI-assisted journaling for nature-based wellness.</p>
      <nav className="mt-6 flex gap-4">
        <Link href="/entries" className="text-blue-600 underline">
          Journal entries
        </Link>
        <Link href="/entries/new" className="text-blue-600 underline">
          New entry
        </Link>
        <Link href="/insights" className="text-blue-600 underline">
          Insights
        </Link>
      </nav>
    </main>
  );
}

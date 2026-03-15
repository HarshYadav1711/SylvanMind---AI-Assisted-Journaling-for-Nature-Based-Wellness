"use client";

import { useState, useEffect, useCallback } from "react";
import { createEntry, getEntries, analyzeText } from "@/lib/api";
import { useUserId } from "@/lib/useUserId";
import type { JournalEntry, Ambience } from "@/types/journal";
import type { AnalysisResult } from "@/types/journal";

const AMBIENCES: { value: Ambience; label: string }[] = [
  { value: "forest", label: "Forest" },
  { value: "ocean", label: "Ocean" },
  { value: "mountain", label: "Mountain" },
];

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

export default function JournalPage() {
  const [userId, setUserId] = useUserId();
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState<Ambience>("forest");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    if (!userId.trim()) {
      setEntries([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getEntries(userId);
      setEntries(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleSave() {
    const t = text.trim();
    if (!t) {
      setError("Please enter some text.");
      return;
    }
    if (!userId.trim()) {
      setError("Please set your user ID above.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createEntry({ userId, text: t, ambience });
      setText("");
      setAmbience("forest");
      await loadEntries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save entry");
    } finally {
      setSaving(false);
    }
  }

  async function handleAnalyze() {
    const t = text.trim();
    if (!t) {
      setError("Enter some text to analyze.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeText(t);
      setAnalysis(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-sage-800">
        Journal
      </h1>

      {!userId && (
        <div className="mt-6 rounded-lg border border-sage-200 bg-sage-50/50 p-4">
          <label className="block text-sm font-medium text-stone-700">
            Your user ID
          </label>
          <p className="mt-1 text-sm text-stone-600">
            Set this once (use an ID from the seed data or your backend).
          </p>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. 507f1f77bcf86cd799439011"
            className="mt-2 w-full rounded-md border border-sage-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
          />
        </div>
      )}

      <section className="mt-8">
        <label className="block text-sm font-medium text-stone-700">
          New entry
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What’s on your mind?"
          rows={5}
          className="mt-2 w-full resize-y rounded-lg border border-sage-200 bg-white px-4 py-3 text-stone-800 placeholder-stone-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={ambience}
            onChange={(e) => setAmbience(e.target.value as Ambience)}
            className="rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
          >
            {AMBIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sage-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save entry"}
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !text.trim()}
            className="rounded-lg border border-sage-300 bg-white px-4 py-2 text-sm font-medium text-sage-700 transition hover:bg-sage-50 disabled:opacity-60"
          >
            {analyzing ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </section>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {analysis && (
        <div className="mt-6 rounded-lg border border-sage-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-sage-800">Analysis</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-stone-500">Emotion</dt>
              <dd className="capitalize text-stone-800">{analysis.emotion || "—"}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Keywords</dt>
              <dd className="text-stone-800">
                {analysis.keywords?.length
                  ? analysis.keywords.join(", ")
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">Summary</dt>
              <dd className="text-stone-800">{analysis.summary || "—"}</dd>
            </div>
          </dl>
        </div>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-lg font-medium text-sage-800">
          Recent entries
        </h2>
        {loading ? (
          <p className="mt-2 text-sm text-stone-500">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">
            {userId ? "No entries yet. Write something above." : "Set your user ID to see entries."}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {entries.map((entry) => (
              <li
                key={entry._id}
                className="rounded-lg border border-sage-200 bg-white p-4 shadow-sm"
              >
                <p className="text-sm text-stone-800 line-clamp-2">
                  {entry.text}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                  <span className="capitalize">{entry.ambience}</span>
                  <span>·</span>
                  <time dateTime={entry.createdAt}>
                    {formatDate(entry.createdAt)}
                  </time>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

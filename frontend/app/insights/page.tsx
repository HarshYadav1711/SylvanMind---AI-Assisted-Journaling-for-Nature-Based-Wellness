"use client";

import { useState, useEffect } from "react";
import { getInsights } from "@/lib/api";
import { useUserId } from "@/lib/useUserId";

export default function InsightsPage() {
  const [userId] = useUserId();
  const [insights, setInsights] = useState<{
    totalEntries: number;
    topEmotion: string | null;
    mostUsedAmbience: string | null;
    recentKeywords: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId.trim()) {
      setInsights(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getInsights(userId)
      .then((data) => {
        if (!cancelled) setInsights(data);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load insights");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-sage-800">
        Insights
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        A gentle snapshot of your journal patterns.
      </p>

      {!userId && (
        <div className="mt-6 rounded-lg border border-sage-200 bg-sage-50/50 p-4 text-sm text-stone-600">
          Set your user ID on the Journal page to see insights.
        </div>
      )}

      {userId && loading && (
        <p className="mt-6 text-sm text-stone-500">Loading…</p>
      )}

      {userId && error && (
        <p className="mt-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {userId && !loading && !error && insights && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-sage-200 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Total entries
            </h2>
            <p className="mt-2 font-serif text-2xl text-sage-800">
              {insights.totalEntries}
            </p>
          </div>
          <div className="rounded-lg border border-sage-200 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Top emotion
            </h2>
            <p className="mt-2 font-serif text-xl capitalize text-sage-800">
              {insights.topEmotion ?? "—"}
            </p>
          </div>
          <div className="rounded-lg border border-sage-200 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Most used ambience
            </h2>
            <p className="mt-2 font-serif text-xl capitalize text-sage-800">
              {insights.mostUsedAmbience ?? "—"}
            </p>
          </div>
          <div className="rounded-lg border border-sage-200 bg-white p-5 shadow-sm sm:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Recent keywords
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {insights.recentKeywords.length === 0 ? (
                <span className="text-stone-500">None yet</span>
              ) : (
                insights.recentKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-sage-100 px-3 py-1 text-sm text-sage-800"
                  >
                    {kw}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {userId && !loading && !error && insights && insights.totalEntries === 0 && (
        <p className="mt-6 text-sm text-stone-500">
          Write a few journal entries to see insights here.
        </p>
      )}
    </main>
  );
}

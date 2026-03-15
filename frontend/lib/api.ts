import type { JournalEntry, AnalysisResult } from "@/types/journal";
import type { Insights } from "./api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getEntries(userId: string): Promise<JournalEntry[]> {
  const res = await fetchApi<{ data: JournalEntry[] }>(
    `/journal/${encodeURIComponent(userId)}`
  );
  return res.data;
}

export async function createEntry(data: {
  userId: string;
  text: string;
  ambience: "forest" | "ocean" | "mountain";
}): Promise<JournalEntry> {
  const res = await fetchApi<{ data: JournalEntry }>("/journal", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  return fetchApi<AnalysisResult>("/journal/analyze", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function getInsights(userId: string): Promise<Insights> {
  const res = await fetchApi<{ data: Insights }>(
    `/journal/insights/${encodeURIComponent(userId)}`
  );
  return res.data;
}

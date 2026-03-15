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
  return fetchApi<JournalEntry[]>(`/entries?userId=${encodeURIComponent(userId)}`);
}

export async function getEntry(id: string): Promise<JournalEntry> {
  return fetchApi<JournalEntry>(`/entries/${id}`);
}

export async function createEntry(data: {
  userId: string;
  text: string;
  ambience: "forest" | "ocean" | "mountain";
}): Promise<JournalEntry> {
  return fetchApi<JournalEntry>("/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function analyzeEntry(entryId: string): Promise<AnalysisResult> {
  return fetchApi<AnalysisResult>(`/entries/${entryId}/analyze`, { method: "POST" });
}

export async function getInsights(userId: string): Promise<Insights> {
  return fetchApi<Insights>(`/insights?userId=${encodeURIComponent(userId)}`);
}

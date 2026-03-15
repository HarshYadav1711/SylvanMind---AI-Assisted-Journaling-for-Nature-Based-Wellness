import type { JournalEntry, AnalysisResult } from "@/types/journal";
import type { Insights } from "./api.types";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const text = await res.text();
  if (!res.ok) {
    if (text.startsWith("<!") || text.includes("</html>")) {
      throw new Error(
        "Backend request failed. Ensure the backend is running (e.g. npm run dev in backend) and reachable."
      );
    }
    throw new Error(text || `Request failed (${res.status})`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response from server");
  }
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

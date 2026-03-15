export type Ambience = "forest" | "ocean" | "mountain";

export interface JournalEntryAnalysis {
  emotion?: string;
  keywords?: string[];
  summary?: string;
}

export interface JournalEntry {
  _id: string;
  userId: string;
  text: string;
  ambience: Ambience;
  createdAt: string;
  analysis?: JournalEntryAnalysis;
}

export interface AnalysisResult {
  emotion: string;
  keywords: string[];
  summary: string;
}

import { ObjectId } from "mongodb";
import { getDb } from "../utils/db";

export type Ambience = "forest" | "ocean" | "mountain";

export interface JournalEntryAnalysis {
  emotion?: string;
  keywords?: string[];
  summary?: string;
}

export interface JournalEntry {
  _id: ObjectId;
  userId: ObjectId;
  text: string;
  ambience: Ambience;
  createdAt: Date;
  analysis?: JournalEntryAnalysis;
}

const COLLECTION = "journal_entries";

export function getJournalEntriesCollection() {
  return getDb().collection<JournalEntry>(COLLECTION);
}

import { ObjectId } from "mongodb";
import { getJournalEntriesCollection } from "../models/JournalEntry";
import type { Ambience } from "../models/JournalEntry";
import type { JournalEntryAnalysis } from "../models/JournalEntry";

export interface CreateEntryInput {
  userId: string;
  text: string;
  ambience: Ambience;
}

export async function createEntry(input: CreateEntryInput) {
  const col = getJournalEntriesCollection();
  const doc = {
    _id: new ObjectId(),
    userId: new ObjectId(input.userId),
    text: input.text,
    ambience: input.ambience,
    createdAt: new Date(),
    analysis: undefined as JournalEntryAnalysis | undefined,
  };
  await col.insertOne(doc);
  return doc;
}

export async function getEntriesByUserId(userId: string) {
  const col = getJournalEntriesCollection();
  return col.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
}

export async function getEntryById(entryId: string) {
  const col = getJournalEntriesCollection();
  const entry = await col.findOne({ _id: new ObjectId(entryId) });
  return entry ?? null;
}

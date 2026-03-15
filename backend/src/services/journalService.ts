import { JournalEntry } from "../models/JournalEntry";
import type { Ambience } from "../models/JournalEntry";

export interface CreateEntryInput {
  userId: string;
  text: string;
  ambience: Ambience;
}

export async function createEntry(input: CreateEntryInput) {
  const entry = await JournalEntry.create({
    userId: input.userId,
    text: input.text,
    ambience: input.ambience,
  });
  return entry.toObject();
}

export async function getEntriesByUserId(userId: string) {
  const entries = await JournalEntry.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return entries;
}

export async function getEntryById(entryId: string) {
  const entry = await JournalEntry.findById(entryId).lean();
  return entry ?? null;
}

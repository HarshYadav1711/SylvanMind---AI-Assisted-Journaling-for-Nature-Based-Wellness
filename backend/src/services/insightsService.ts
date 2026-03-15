import { Types } from "mongoose";
import { JournalEntry } from "../models/JournalEntry";

export interface Insights {
  totalEntries: number;
  topEmotion: string | null;
  mostUsedAmbience: string | null;
  recentKeywords: string[];
}

const RECENT_KEYWORDS_ENTRY_LIMIT = 15;
const RECENT_KEYWORDS_MAX = 5;

export async function getInsights(userId: string): Promise<Insights> {
  const uid = new Types.ObjectId(userId);
  const [result] = await JournalEntry.aggregate<{
    totalEntries: { total: number }[];
    topEmotion: { _id: string }[];
    mostUsedAmbience: { _id: string }[];
    recentKeywords: { keywords: string[] }[];
  }>([
    { $match: { userId: uid } },
    {
      $facet: {
        totalEntries: [{ $count: "total" }],
        topEmotion: [
          { $match: { "analysis.emotion": { $exists: true, $ne: "" } } },
          { $group: { _id: "$analysis.emotion", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ],
        mostUsedAmbience: [
          { $group: { _id: "$ambience", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ],
        recentKeywords: [
          { $sort: { createdAt: -1 } },
          { $limit: RECENT_KEYWORDS_ENTRY_LIMIT },
          { $project: { keywords: { $ifNull: ["$analysis.keywords", []] } } },
        ],
      },
    },
  ]);

  if (!result) {
    return {
      totalEntries: 0,
      topEmotion: null,
      mostUsedAmbience: null,
      recentKeywords: [],
    };
  }

  const totalEntries = result.totalEntries[0]?.total ?? 0;
  const topEmotion = result.topEmotion[0]?._id ?? null;
  const mostUsedAmbience = result.mostUsedAmbience[0]?._id ?? null;

  const seen = new Set<string>();
  const recentKeywords: string[] = [];
  for (const row of result.recentKeywords) {
    for (const kw of row.keywords ?? []) {
      const k = (kw ?? "").trim().toLowerCase();
      if (k && !seen.has(k)) {
        seen.add(k);
        recentKeywords.push(kw.trim());
        if (recentKeywords.length >= RECENT_KEYWORDS_MAX) break;
      }
    }
    if (recentKeywords.length >= RECENT_KEYWORDS_MAX) break;
  }

  return {
    totalEntries,
    topEmotion,
    mostUsedAmbience,
    recentKeywords,
  };
}

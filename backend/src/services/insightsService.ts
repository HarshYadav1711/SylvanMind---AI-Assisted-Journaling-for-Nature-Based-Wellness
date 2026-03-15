import { Types } from "mongoose";
import { JournalEntry } from "../models/JournalEntry";

export interface Insights {
  totalEntries: number;
  topEmotion: string | null;
  mostUsedAmbience: string | null;
  recentKeywords: string[];
  emotionDistribution: Record<string, number>;
}

const RECENT_KEYWORDS_ENTRY_LIMIT = 15;
const RECENT_KEYWORDS_MAX = 5;

export async function getInsights(userId: string): Promise<Insights> {
  const uid = new Types.ObjectId(userId);
  const [result] = await JournalEntry.aggregate<{
    totalEntries: { total: number }[];
    topEmotion: { _id: string }[];
    mostUsedAmbience: { _id: string }[];
    emotionCounts: { _id: string; count: number }[];
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
        emotionCounts: [
          { $match: { "analysis.emotion": { $exists: true, $ne: "" } } },
          { $group: { _id: "$analysis.emotion", count: { $sum: 1 } } },
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
      emotionDistribution: {},
    };
  }

  const totalEntries = result.totalEntries[0]?.total ?? 0;
  const topEmotion = result.topEmotion[0]?._id ?? null;
  const mostUsedAmbience = result.mostUsedAmbience[0]?._id ?? null;
  const emotionCounts = result.emotionCounts ?? [];
  const totalAnalyzed = emotionCounts.reduce((sum, e) => sum + e.count, 0);
  const emotionDistribution: Record<string, number> =
    totalAnalyzed === 0
      ? {}
      : Object.fromEntries(
          emotionCounts.map((e) => [e._id, Math.round((e.count / totalAnalyzed) * 100)])
        );

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
    emotionDistribution,
  };
}

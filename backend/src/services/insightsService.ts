export interface Insights {
  topEmotion: string | null;
  topAmbience: string | null;
  recentKeywords: string[];
}

export async function getInsights(_userId: string): Promise<Insights> {
  // Stub: no real aggregation yet
  return {
    topEmotion: null,
    topAmbience: null,
    recentKeywords: [],
  };
}

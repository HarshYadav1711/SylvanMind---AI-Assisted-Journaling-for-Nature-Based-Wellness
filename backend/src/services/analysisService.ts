import * as huggingface from "./huggingface";
import { extractKeywords } from "./keywordService";
import {
  analysisCacheKey,
  getCachedAnalysis,
  setCachedAnalysis,
  type CachedAnalysis,
} from "../utils/cache";

export interface AnalysisResult {
  emotion: string;
  keywords: string[];
  summary: string;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const trimmed = text.trim();
  const key = analysisCacheKey(trimmed);

  const cached = await getCachedAnalysis(key);
  if (cached) {
    return cached;
  }

  const [emotion, keywords, summary] = await Promise.all([
    huggingface.fetchEmotion(trimmed),
    Promise.resolve(extractKeywords(trimmed)),
    huggingface.fetchSummary(trimmed),
  ]);

  const result: AnalysisResult = {
    emotion,
    keywords,
    summary: summary || trimmed.slice(0, 200),
  };

  await setCachedAnalysis(key, result);
  return result;
}

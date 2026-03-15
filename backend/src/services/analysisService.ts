export interface AnalysisResult {
  emotion: string;
  keywords: string[];
  summary: string;
}

/**
 * Analyze journal text for emotion, keywords, and summary.
 * Implementation will use HuggingFace inference API with fallback to natural for keywords.
 */
export async function analyzeText(_text: string): Promise<AnalysisResult> {
  // Stub: not implemented yet
  return {
    emotion: "",
    keywords: [],
    summary: "",
  };
}

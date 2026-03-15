/**
 * Stub for HuggingFace inference API (emotion/summary).
 * Set HUGGINGFACE_API_KEY in .env when implementing.
 */
export async function analyzeWithHuggingFace(_text: string): Promise<{ emotion: string; summary: string }> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY not set");
  }
  throw new Error("Not implemented");
}

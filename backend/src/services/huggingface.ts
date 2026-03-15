import { InferenceClient } from "@huggingface/inference";

const EMOTION_MODEL = "j-hartmann/emotion-english-distilroberta-base";
const SUMMARIZATION_MODEL = "facebook/bart-large-cnn";
const DEFAULT_TIMEOUT_MS = 30_000;

function getClient(): InferenceClient {
  const key = process.env.HUGGINGFACE_API_KEY?.trim();
  if (!key) {
    throw new Error("HUGGINGFACE_API_KEY is required for analysis");
  }
  return new InferenceClient(key);
}

function withTimeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function fetchEmotion(
  text: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<string> {
  const trimmed = text.trim();
  if (trimmed.length === 0) return "neutral";

  const client = getClient();
  const result = await withTimeout(
    timeoutMs,
    client.textClassification({
      model: EMOTION_MODEL,
      inputs: trimmed,
    })
  );

  const items = Array.isArray(result) ? result : [result];
  const top = items
    .filter((x): x is { label: string; score: number } => typeof x === "object" && x !== null && "label" in x && "score" in x)
    .sort((a, b) => b.score - a.score)[0];
  return top?.label ?? "neutral";
}

export async function fetchSummary(
  text: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<string> {
  const trimmed = text.trim();
  if (trimmed.length === 0) return "";

  const client = getClient();
  const result = await withTimeout(
    timeoutMs,
    client.summarization({
      model: SUMMARIZATION_MODEL,
      inputs: trimmed,
    })
  );

  if (result && typeof result === "object" && "summary_text" in result) {
    return String((result as { summary_text: string }).summary_text).trim();
  }
  return "";
}

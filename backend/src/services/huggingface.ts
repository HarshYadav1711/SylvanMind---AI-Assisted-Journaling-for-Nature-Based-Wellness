const HF_BASE = "https://api-inference.huggingface.co/models";
const EMOTION_MODEL = "j-hartmann/emotion-english-distilroberta-base";
const SUMMARIZATION_MODEL = "facebook/bart-large-cnn";
const DEFAULT_TIMEOUT_MS = 30_000;

function getApiKey(): string {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key?.trim()) {
    throw new Error("HUGGINGFACE_API_KEY is required for analysis");
  }
  return key.trim();
}

async function fetchInference<T>(
  model: string,
  inputs: string,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${HF_BASE}/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HuggingFace API error (${res.status}): ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

function withTimeout<T>(ms: number, promise: Promise<T>, signal?: AbortSignal): Promise<T> {
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
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new Error("Request aborted"));
      });
    }
  });
}

type EmotionLabel = { label: string; score: number };

function normalizeEmotionResult(result: unknown): EmotionLabel[] {
  if (Array.isArray(result)) {
    const first = result[0];
    if (Array.isArray(first)) return first as EmotionLabel[];
    if (first && typeof first === "object" && "label" in first && "score" in first) {
      return result as EmotionLabel[];
    }
  }
  return [];
}

export async function fetchEmotion(
  text: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<string> {
  const trimmed = text.trim();
  if (trimmed.length === 0) return "neutral";

  const controller = new AbortController();
  const result = await withTimeout<unknown>(
    timeoutMs,
    fetchInference<unknown>(EMOTION_MODEL, trimmed, controller.signal),
    controller.signal
  );

  const scores = normalizeEmotionResult(result);
  const top = scores.sort((a, b) => b.score - a.score)[0];
  return top?.label ?? "neutral";
}

export async function fetchSummary(
  text: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<string> {
  const trimmed = text.trim();
  if (trimmed.length === 0) return "";

  const controller = new AbortController();
  const result = await withTimeout<unknown>(
    timeoutMs,
    fetchInference<unknown>(SUMMARIZATION_MODEL, trimmed, controller.signal),
    controller.signal
  );

  if (Array.isArray(result) && result[0] && typeof result[0] === "object" && "summary_text" in result[0]) {
    return String((result[0] as { summary_text: string }).summary_text).trim();
  }
  return "";
}

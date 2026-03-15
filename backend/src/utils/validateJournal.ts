import type { Ambience } from "../models/JournalEntry";

const AMBIENCE_VALUES: Ambience[] = ["forest", "ocean", "mountain"];

export interface CreateJournalBody {
  userId?: string;
  text?: string;
  ambience?: string;
}

export interface ValidationResult {
  valid: true;
  userId: string;
  text: string;
  ambience: Ambience;
}

export interface ValidationError {
  valid: false;
  message: string;
}

export function validateCreateJournalBody(body: CreateJournalBody): ValidationResult | ValidationError {
  const { userId, text, ambience } = body;

  if (!userId || typeof userId !== "string") {
    return { valid: false, message: "userId is required" };
  }

  const trimmedText = typeof text === "string" ? text.trim() : "";
  if (trimmedText.length === 0) {
    return { valid: false, message: "text must not be empty" };
  }

  if (!ambience || typeof ambience !== "string") {
    return { valid: false, message: "ambience is required" };
  }
  const ambienceLower = ambience.toLowerCase();
  if (!AMBIENCE_VALUES.includes(ambienceLower as Ambience)) {
    return {
      valid: false,
      message: `ambience must be one of: ${AMBIENCE_VALUES.join(", ")}`,
    };
  }

  return {
    valid: true,
    userId,
    text: trimmedText,
    ambience: ambienceLower as Ambience,
  };
}

import rateLimit from "express-rate-limit";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * General API rate limiter: 100 requests per IP per 15 minutes.
 * Applied to all /api routes to protect the backend from abuse.
 */
export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter limiter for the analysis endpoint only.
 * Analysis calls HuggingFace and local NLP; we cap at 20 per IP per 15 minutes
 * to control cost and prevent a single client from exhausting the NLP pipeline.
 */
export const analysisLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 20,
  message: { error: "Analysis rate limit exceeded. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

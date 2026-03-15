import { Request, Response } from "express";
import * as journalService from "../services/journalService";
import * as analysisService from "../services/analysisService";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCreateJournalBody } from "../utils/validateJournal";
import { AppError } from "../utils/errors";

export const createEntry = asyncHandler(async (req: Request, res: Response) => {
  const result = validateCreateJournalBody(req.body);
  if (!result.valid) {
    throw new AppError(result.message, 400);
  }
  const entry = await journalService.createEntry({
    userId: result.userId,
    text: result.text,
    ambience: result.ambience,
  });
  res.status(201).json({ data: entry });
});

export const getEntriesByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    throw new AppError("userId is required", 400);
  }
  const entries = await journalService.getEntriesByUserId(userId);
  res.json({ data: entries });
});

export const analyzeJournal = asyncHandler(async (req: Request, res: Response) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (text.length === 0) {
    throw new AppError("text is required and must not be empty", 400);
  }
  const result = await analysisService.analyzeText(text);
  res.json({
    emotion: result.emotion,
    keywords: result.keywords,
    summary: result.summary,
  });
});

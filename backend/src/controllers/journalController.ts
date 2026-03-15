import { Request, Response } from "express";
import * as journalService from "../services/journalService";
import * as analysisService from "../services/analysisService";
import { asyncHandler } from "../utils/asyncHandler";

export const createEntry = asyncHandler(async (req: Request, res: Response) => {
  const { userId, text, ambience } = req.body;
  if (!userId || !text || !ambience) {
    res.status(400).json({ error: "userId, text, and ambience are required" });
    return;
  }
  const entry = await journalService.createEntry({ userId, text, ambience });
  res.status(201).json(entry);
});

export const getEntries = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(400).json({ error: "userId query is required" });
    return;
  }
  const entries = await journalService.getEntriesByUserId(userId);
  res.json(entries);
});

export const getEntryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await journalService.getEntryById(id);
  if (!entry) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  res.json(entry);
});

export const analyzeEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await journalService.getEntryById(id);
  if (!entry) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  const analysis = await analysisService.analyzeText(entry.text);
  res.json(analysis);
});

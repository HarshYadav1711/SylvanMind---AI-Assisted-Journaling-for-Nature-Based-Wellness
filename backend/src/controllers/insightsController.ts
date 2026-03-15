import { Request, Response } from "express";
import * as insightsService from "../services/insightsService";
import { asyncHandler } from "../utils/asyncHandler";

export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(400).json({ error: "userId query is required" });
    return;
  }
  const insights = await insightsService.getInsights(userId);
  res.json(insights);
});

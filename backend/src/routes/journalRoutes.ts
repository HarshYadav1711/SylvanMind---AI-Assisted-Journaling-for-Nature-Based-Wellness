import { Router } from "express";
import * as journalController from "../controllers/journalController";

const router = Router();

router.post("/journal", journalController.createEntry);
router.post("/journal/analyze", journalController.analyzeJournal);
router.get("/journal/insights/:userId", journalController.getInsightsByUserId);
router.get("/journal/:userId", journalController.getEntriesByUserId);

export default router;

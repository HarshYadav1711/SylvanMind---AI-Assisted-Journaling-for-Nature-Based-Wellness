import { Router } from "express";
import * as journalController from "../controllers/journalController";

const router = Router();

router.post("/entries", journalController.createEntry);
router.get("/entries", journalController.getEntries);
router.get("/entries/:id", journalController.getEntryById);
router.post("/entries/:id/analyze", journalController.analyzeEntry);

export default router;

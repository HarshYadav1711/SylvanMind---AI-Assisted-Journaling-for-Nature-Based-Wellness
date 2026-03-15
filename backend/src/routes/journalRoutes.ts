import { Router } from "express";
import * as journalController from "../controllers/journalController";

const router = Router();

router.post("/journal", journalController.createEntry);
router.get("/journal/:userId", journalController.getEntriesByUserId);

export default router;

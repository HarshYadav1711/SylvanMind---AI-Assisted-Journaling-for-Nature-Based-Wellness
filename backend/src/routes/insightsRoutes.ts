import { Router } from "express";
import * as insightsController from "../controllers/insightsController";

const router = Router();

router.get("/insights", insightsController.getInsights);

export default router;

import { Router } from "express";
import journalRoutes from "./journalRoutes";
import insightsRoutes from "./insightsRoutes";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

routes.use(journalRoutes);
routes.use(insightsRoutes);

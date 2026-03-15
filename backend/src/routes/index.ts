import { Router } from "express";
import journalRoutes from "./journalRoutes";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

routes.use(journalRoutes);

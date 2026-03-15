import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { routes } from "./routes";

function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(500).json({ error: err.message ?? "Internal server error" });
}

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api", routes);
  app.use(errorHandler);
  return app;
}

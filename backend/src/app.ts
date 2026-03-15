import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api", apiLimiter, routes);
  app.use(errorHandler);
  return app;
}

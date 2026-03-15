import dotenv from "dotenv";
import { connectToDatabase } from "./utils/db";
import { createApp } from "./app";

dotenv.config();

const PORT = process.env.PORT ?? 3001;
const DB_RETRY_ATTEMPTS = 10;
const DB_RETRY_DELAY_MS = 2000;

async function connectWithRetry(): Promise<void> {
  for (let i = 0; i < DB_RETRY_ATTEMPTS; i++) {
    try {
      await connectToDatabase();
      return;
    } catch (err) {
      if (i === DB_RETRY_ATTEMPTS - 1) throw err;
      console.warn(`Database connection attempt ${i + 1} failed, retrying in ${DB_RETRY_DELAY_MS}ms...`);
      await new Promise((r) => setTimeout(r, DB_RETRY_DELAY_MS));
    }
  }
}

async function start() {
  await connectWithRetry();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`SylvanMind backend listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

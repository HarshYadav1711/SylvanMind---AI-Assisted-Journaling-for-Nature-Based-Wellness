import dotenv from "dotenv";
import { connectToDatabase } from "./utils/db";
import { createApp } from "./app";

dotenv.config();

const PORT = process.env.PORT ?? 3001;

async function start() {
  await connectToDatabase();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`SylvanMind backend listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

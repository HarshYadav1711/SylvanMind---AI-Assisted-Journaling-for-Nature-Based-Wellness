import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/sylvanmind";

export async function connectToDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export function disconnectDatabase(): Promise<void> {
  return mongoose.disconnect();
}

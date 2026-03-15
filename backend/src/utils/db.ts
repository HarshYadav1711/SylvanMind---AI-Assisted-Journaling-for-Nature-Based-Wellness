import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/sylvanmind";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db();
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error("Database not connected. Call connectToDatabase first.");
  return db;
}

import { ObjectId } from "mongodb";
import { getDb } from "../utils/db";

export interface User {
  _id: ObjectId;
  name?: string;
  createdAt: Date;
}

const COLLECTION = "users";

export function getUsersCollection() {
  return getDb().collection<User>(COLLECTION);
}

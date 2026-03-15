import dotenv from "dotenv";
import { connectToDatabase, disconnectDatabase } from "../utils/db";
import { User } from "../models/User";
import { JournalEntry } from "../models/JournalEntry";

dotenv.config();

async function seed() {
  await connectToDatabase();

  const users = await User.insertMany([
    { name: "Alex River", email: "alex@example.com" },
    { name: "Sam Forest", email: "sam@example.com" },
  ]);

  const [alex, sam] = users;

  await JournalEntry.insertMany([
    {
      userId: alex._id,
      text: "Spent the morning walking through the pine forest. The light through the trees felt like a kind of peace I can't find anywhere else.",
      ambience: "forest",
      analysis: {
        emotion: "calm",
        keywords: ["forest", "peace", "light", "morning"],
        summary: "A reflective morning walk in the forest brought a sense of peace.",
        analyzedAt: new Date(),
      },
    },
    {
      userId: alex._id,
      text: "Waves crashing on the shore. Sometimes the ocean reminds me that everything is bigger than my worries.",
      ambience: "ocean",
      analysis: {
        emotion: "contemplative",
        keywords: ["ocean", "waves", "shore", "worries"],
        summary: "The ocean provided perspective and a reminder of scale.",
        analyzedAt: new Date(),
      },
    },
    {
      userId: sam._id,
      text: "Reached the summit at dawn. Cold wind, endless views. Felt alive.",
      ambience: "mountain",
      analysis: {
        emotion: "energized",
        keywords: ["summit", "dawn", "wind", "views"],
        summary: "A rewarding mountain summit at dawn brought a feeling of being alive.",
        analyzedAt: new Date(),
      },
    },
  ]);

  console.log("Seed completed: 2 users, 3 journal entries.");
  await disconnectDatabase();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

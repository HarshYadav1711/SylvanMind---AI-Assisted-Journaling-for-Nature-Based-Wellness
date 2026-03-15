import dotenv from "dotenv";
import { connectToDatabase, disconnectDatabase } from "../utils/db";
import { User } from "../models/User";
import { JournalEntry } from "../models/JournalEntry";

dotenv.config();

const DEMO_USER_EMAIL = "demo@sylvanmind.app";

async function seedDemoData() {
  await connectToDatabase();

  const existing = await User.findOne({ email: DEMO_USER_EMAIL }).select("_id");
  if (existing) {
    console.log("Demo data already exists (user:", existing._id.toString() + "). Skipping.");
    await disconnectDatabase();
    process.exit(0);
    return;
  }

  const [demoUser] = await User.insertMany([
    { name: "Demo User", email: DEMO_USER_EMAIL },
  ]);

  await JournalEntry.insertMany([
    {
      userId: demoUser._id,
      text: "Morning walk in the woods. The light through the leaves and the sound of birds made everything else fade away. I want to remember this feeling.",
      ambience: "forest",
      analysis: {
        emotion: "calm",
        keywords: ["walk", "woods", "light", "birds", "morning"],
        summary: "A peaceful morning walk in the forest brought a sense of calm and presence.",
        analyzedAt: new Date(),
      },
    },
    {
      userId: demoUser._id,
      text: "Sat by the ocean for an hour. Waves coming in, one after another. Grateful for this place and for having time to just be here.",
      ambience: "ocean",
      analysis: {
        emotion: "gratitude",
        keywords: ["ocean", "waves", "grateful", "time"],
        summary: "Time spent by the ocean inspired gratitude and a sense of being present.",
        analyzedAt: new Date(),
      },
    },
    {
      userId: demoUser._id,
      text: "Reached the ridge at sunrise. Cold air, huge sky. I felt completely alive and full of energy. Best hike in months.",
      ambience: "mountain",
      analysis: {
        emotion: "joy",
        keywords: ["ridge", "sunrise", "hike", "energy", "sky"],
        summary: "A sunrise hike to a mountain ridge brought joy and a surge of energy.",
        analyzedAt: new Date(),
      },
    },
    {
      userId: demoUser._id,
      text: "Another day in the forest trail. Nothing special happened—just walking, thinking about work. Felt okay, neither up nor down.",
      ambience: "forest",
      analysis: {
        emotion: "neutral",
        keywords: ["forest", "trail", "walking", "work"],
        summary: "A routine forest walk with neutral mood and thoughts about work.",
        analyzedAt: new Date(),
      },
    },
    {
      userId: demoUser._id,
      text: "Evening at the beach. The sound of the waves is the only thing that slows my mind down. I need this more often.",
      ambience: "ocean",
      analysis: {
        emotion: "calm",
        keywords: ["beach", "waves", "evening", "mind"],
        summary: "An evening by the ocean helped quiet the mind; the author wants more of this.",
        analyzedAt: new Date(),
      },
    },
  ]);

  console.log("Demo seed completed: 1 user, 5 journal entries.");
  console.log("Demo user ID (use in frontend):", demoUser._id.toString());
  await disconnectDatabase();
  process.exit(0);
}

seedDemoData().catch((err) => {
  console.error("Demo seed failed:", err);
  process.exit(1);
});

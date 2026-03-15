import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type Ambience = "forest" | "ocean" | "mountain";

const AMBIENCE_VALUES: Ambience[] = ["forest", "ocean", "mountain"];

export interface IJournalEntryAnalysis {
  emotion?: string;
  keywords?: string[];
  summary?: string;
  analyzedAt?: Date;
}

export interface IJournalEntry extends Document {
  userId: Types.ObjectId;
  text: string;
  ambience: Ambience;
  createdAt: Date;
  analysis?: IJournalEntryAnalysis;
}

const analysisSubschema = new Schema<IJournalEntryAnalysis>(
  {
    emotion: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    summary: { type: String, trim: true },
    analyzedAt: { type: Date, default: undefined },
  },
  { _id: false }
);

const journalEntrySchema = new Schema<IJournalEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    text: {
      type: String,
      required: [true, "Text is required"],
      trim: true,
    },
    ambience: {
      type: String,
      required: [true, "Ambience is required"],
      enum: {
        values: AMBIENCE_VALUES,
        message: `Ambience must be one of: ${AMBIENCE_VALUES.join(", ")}`,
      },
    },
    analysis: {
      type: analysisSubschema,
      default: undefined,
    },
  },
  { timestamps: true }
);

journalEntrySchema.index({ userId: 1 });
journalEntrySchema.index({ createdAt: -1 });
journalEntrySchema.index({ userId: 1, createdAt: -1 });

export const JournalEntry: Model<IJournalEntry> =
  mongoose.models.JournalEntry ??
  mongoose.model<IJournalEntry>("JournalEntry", journalEntrySchema);

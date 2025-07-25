import { Schema, model, Types } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    snippetId: { type: Types.ObjectId, ref: "Snippet" },
    action: { type: String, required: true }, // e.g., "created", "edited", "deleted", "starred"
  },
  { timestamps: true }
);

export const ActivityLog = model("ActivityLog", ActivityLogSchema);

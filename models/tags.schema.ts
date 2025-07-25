import { Schema, model, Types } from "mongoose";

const TagSchema = new Schema(
  {
    name: { type: String, required: true },
    // Optional: userId if tags are personal
    // userId: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Tag = model("Tag", TagSchema);

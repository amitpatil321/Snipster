import { Schema, model, Types } from "mongoose";

const FolderSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Folder = model("Folder", FolderSchema);

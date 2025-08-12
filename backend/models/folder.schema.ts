import { Schema, model, Types } from "mongoose";

const FolderSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Folder = model("Folder", FolderSchema);

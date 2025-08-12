import { Schema, model, Types } from "mongoose";

const SnippetSchema = new Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    description: String,
    language: String,
    folderId: { type: Types.ObjectId, ref: "Folder" },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    tagIds: [{ type: Types.ObjectId, ref: "Tag" }],
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Snippet = model("Snippet", SnippetSchema);

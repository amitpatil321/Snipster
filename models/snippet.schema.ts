import { Schema, model, Types } from "mongoose";

const SnippetSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: String,
    language: String,
    favorite: { type: Boolean },
    folderId: { type: Types.ObjectId, ref: "Folder" },
    createdBy: { type: String, ref: "User", required: true },
    tagIds: [{ type: Types.ObjectId, ref: "Tag" }],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Snippet = model("Snippet", SnippetSchema);

import { Schema, model, Types } from "mongoose";

const CommentSchema = new Schema(
  {
    snippetId: { type: Types.ObjectId, ref: "Snippet", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = model("Comment", CommentSchema);

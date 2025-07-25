import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatarUrl: String,
    bio: String,
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);

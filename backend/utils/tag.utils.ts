import { Types } from "mongoose";
import { Tag } from "../models/tags.schema";

interface TagInput {
  value: string;
  label: string;
}

export const resolveTagIds = async (
  tags: TagInput[]
): Promise<Types.ObjectId[]> => {
  if (!tags || tags.length === 0) return [];

  const tagIds = await Promise.all(
    tags.map(async (tag) => {
      if (Types.ObjectId.isValid(tag.value)) {
        return new Types.ObjectId(tag.value);
      }

      const normalizedName = tag.value.trim().toLowerCase();

      const existingTag = await Tag.findOne({ name: normalizedName });

      if (existingTag) {
        return existingTag._id;
      }

      // Create new tag if not found
      const newTag = await Tag.create({ name: normalizedName });
      return newTag._id;
    })
  );

  return tagIds;
};

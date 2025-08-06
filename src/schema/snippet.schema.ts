import { z } from "zod";

export const snippetSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  language: z.string().optional(),
  folderId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  favorite: z.boolean().default(false),
});

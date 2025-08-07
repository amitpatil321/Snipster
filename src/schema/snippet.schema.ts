import { z } from "zod";

export const snippetSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  folder: z.string().optional(),
  tags: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  language: z.string().min(1, { message: "Language is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

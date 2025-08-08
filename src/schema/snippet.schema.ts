import { z } from "zod";

export const snippetSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(150, "Max 150 characters allowed"),
  description: z.string().max(300, "Max 300 characters allowed").optional(),
  folder: z.string().optional(),
  tags: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .max(5, "Max 5 tags can be selected")
    .optional(),
  language: z.string().min(1, { message: "Language is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

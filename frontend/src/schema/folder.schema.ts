import { z } from "zod";

const addFolderSchema = z.object({
  name: z.string().min(2, "Folder name must be at least 2 characters"),
});

export default addFolderSchema;

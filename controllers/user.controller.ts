import { Request, Response } from "express";
import { withUser } from "../utils/withUser";
import { Folder } from "../models/folder.schema";
import { Snippet } from "../models/snippet.schema";

export const getFolders = withUser(async (req: Request, res: Response) => {
  const userId = req.oidc?.user?.sub;

  try {
    const folders = await Folder.find({ userId });

    const foldersWithSnippetCount = await Promise.all(
      folders.map(async (folder) => {
        const count = await Snippet.countDocuments({ folderId: folder._id });
        return {
          ...folder.toObject(),
          snippetCount: count,
        };
      })
    );

    res.status(200).json({ success: true, data: foldersWithSnippetCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch folders" });
  }
});

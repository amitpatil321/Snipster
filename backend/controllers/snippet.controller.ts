import { Request, Response } from "express";
import { Types } from "mongoose";
import { Folder } from "../models/folder.schema";
import { Snippet } from "../models/snippet.schema";
import { Tag } from "../models/tags.schema";
import { resolveTagIds } from "../utils/tag.utils";
import { withUser } from "../utils/withUser";

export const getCounts = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const [allCount, favCount, trashCount] = await Promise.all([
      Snippet.countDocuments({ deletedAt: { $eq: null }, createdBy: userId }),
      Snippet.countDocuments({
        deletedAt: { $eq: null },
        favorite: true,
        createdBy: userId,
      }),
      Snippet.countDocuments({ deletedAt: { $ne: null }, createdBy: userId }),
    ]);

    res.json({
      success: true,
      data: {
        all: allCount,
        favorite: favCount,
        trash: trashCount,
      },
    });
  } catch (err) {
    console.error("Error getting snippet counts:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch snippet counts" });
  }
});

export const getSnippets = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const type = (req.query.type as string) || "all";
    const folderId = req.query.folderId as string;

    const filter: Record<string, any> = {
      createdBy: userId,
    };

    let sortBy: Record<string, 1 | -1> = {};
    if (type === "favorite") {
      filter.favorite = true;
      filter.deletedAt = null;
      sortBy = { createdAt: -1 };
    } else if (type === "trash") {
      filter.deletedAt = { $ne: null };
      sortBy = { deletedAt: -1 };
    } else if (type === "all") {
      filter.deletedAt = null;
      sortBy = { createdAt: -1 };
    } else if (type === "folder") {
      filter.deletedAt = null;
      if (folderId) {
        filter.folderId = new Types.ObjectId(folderId);
      }
      sortBy = { createdAt: -1 };
    } else {
      filter.deletedAt = null;
      sortBy = { createdAt: -1 };
    }

    const snippets = await Snippet.find(filter)
      .populate({
        path: "folderId",
        model: Folder,
        select: "name",
      })
      .select("-updatedAt -__v -content -tagIds")
      .sort(sortBy)
      .exec();

    res.json({ success: true, data: snippets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch snippets" });
  }
});

export const toggleFavorite = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const { ids, status } = req.body;
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      typeof status !== "boolean"
    ) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const result = await Snippet.updateMany(
      { _id: { $in: ids }, createdBy: userId, deletedAt: null },
      { $set: { favorite: status } }
    );

    return res.status(200).json({
      success: true,
      message: `Snippets marked as ${status ? "favorite" : "unfavorite"}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating favorite status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating favorite status" });
  }
});

export const toggleRemove = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid snippet IDs" });
    }
    const objectIds = ids.map((id: string) => new Types.ObjectId(id));

    const snippets = await Snippet.find({
      _id: { $in: objectIds },
      createdBy: userId,
    });

    if (!snippets || snippets.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Snippets not found or unauthorized",
      });
    }

    for (const snippet of snippets) {
      // If snippet is fav and is getting deleted then remove its fav flag before deleting
      if ((status ?? snippet.deletedAt === null) && snippet.favorite) {
        snippet.favorite = false;
      }

      // If status is provided, use it; otherwise toggle current
      snippet.deletedAt =
        status !== undefined
          ? status
            ? new Date()
            : null
          : snippet.deletedAt
            ? null
            : new Date();

      await snippet.save();
    }

    res.status(200).json({
      success: true,
      message: `Snippets ${
        status === undefined ? "toggled" : status ? "deleted" : "restored"
      } successfully`,
      ids,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error toggling snippet delete status",
    });
  }
});

export const getDetails = withUser(async (req: Request, res: Response) => {
  const userId = req.oidc?.user?.sub;
  const snippetId = req.params.id;
  try {
    const snippet = await Snippet.findOne({
      _id: snippetId,
      createdBy: userId,
    })
      .populate({
        path: "tagIds",
        model: Tag,
        select: "name",
      })
      .populate({
        path: "folderId",
        model: Folder,
        select: "name",
      });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: "Snippet not found",
      });
    }

    res.status(200).json({
      success: true,
      data: snippet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching snippet details",
    });
  }
});

export const saveSnippet = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const { title, description, folder, tags, language, content } = req.body;
    if (!title?.trim() || !language?.trim() || !content?.trim()) {
      res.status(500).json({
        success: false,
        message: "Title, language and content are mandatory fields",
      });
    } else {
      const tagIds = await resolveTagIds(tags);

      const snippet = await Snippet.create({
        ...req.body,
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        folderId: folder ? new Types.ObjectId(folder) : null,
        tagIds,
        createdBy: userId,
      });
      await snippet.populate("folderId", "_id name");

      return res.status(200).json({
        success: true,
        message: "Snippet added successfully!",
        data: snippet,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error adding snippet, Please try again!",
    });
  }
});

export const updateSnippet = withUser(async (req: Request, res: Response) => {
  setTimeout(async () => {
    try {
      const userId = req.oidc?.user?.sub;
      const { id, title, description, folder, tags, language, content } =
        req.body;

      if (!id || !title?.trim() || !language?.trim() || !content?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title, language and content are mandatory fields",
        });
      }

      const tagIds = await resolveTagIds(tags);

      const updatedSnippet = await Snippet.findOneAndUpdate(
        { _id: id, createdBy: userId },
        {
          title: title.trim(),
          description: description.trim(),
          folderId: folder ? new Types.ObjectId(folder) : null,
          tagIds: tagIds,
          language,
          content,
          updatedAt: new Date(),
        },
        { new: true }
      )
        .populate({
          path: "folderId",
          model: Folder,
          select: "name",
        })
        .populate({
          path: "tagIds",
          model: Tag,
          select: "name",
        })
        .exec();

      if (!updatedSnippet) {
        return res.status(404).json({
          success: false,
          message: "Snippet not found or not authorized",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedSnippet,
        message: "Snippet updated successfully!",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error updating snippet, Please try again!",
      });
    }
  }, 3000);
});

export const moveToFolder = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const { snippetIds, folderId } = req.body;

    if (!Array.isArray(snippetIds) || snippetIds.length === 0 || !folderId) {
      return res.status(400).json({
        success: false,
        message: "Snippet IDs and target folder ID are required",
      });
    }

    // Check if folder exists and belongs to user
    const folderExists = await Folder.findOne({
      _id: folderId,
      userId: userId,
    });
    if (!folderExists) {
      return res.status(404).json({
        success: false,
        message: "Target folder not found or not authorized",
      });
    }

    // Update all snippets in the list
    const result = await Snippet.updateMany(
      { _id: { $in: snippetIds }, createdBy: userId },
      { $set: { folderId } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No snippets found or authorized to move",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        updatedCount: result.modifiedCount,
        folderId,
      },
      message: `Moved ${result.modifiedCount} snippet(s) to the ${folderExists.name}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error moving snippet to folder. Please try again!",
    });
  }
});

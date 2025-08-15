import { Request, Response } from "express";
import { Types } from "mongoose";
import { Folder } from "../models/folder.schema";
import { Snippet } from "../models/snippet.schema";
import { Tag } from "../models/tags.schema";
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
  setTimeout(async () => {
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
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch snippets" });
    }
  }, 2000);
});

export const toggleFavorite = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const snippetId = req.params.id;

    if (!snippetId) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid snippet ID" });
    }

    const snippet = await Snippet.findOne({
      _id: new Types.ObjectId(snippetId),
      createdBy: userId,
    });

    if (!snippet) {
      return res
        .status(404)
        .json({ success: false, error: "Snippet not found or unauthorized" });
    }

    if (snippet.deletedAt !== null) {
      // If record is deleted then it cant be favorited
      res.status(403).json({ success: false, message: "Invalid operation" });
    }

    snippet.favorite = snippet.favorite ? false : true;
    await snippet.save();

    res.status(200).json({
      success: true,
      message: "Snippet favorite status updated",
      favorite: snippet.favorite,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating favorite status" });
  }
});

export const toggleRemove = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const snippetId = req.params.id;

    if (!snippetId) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid snippet ID" });
    }

    const snippet = await Snippet.findOne({
      _id: new Types.ObjectId(snippetId),
      createdBy: userId,
    });

    if (!snippet) {
      return res
        .status(404)
        .json({ success: false, error: "Snippet not found or unauthorized" });
    }

    // If snippet is fav and is getting deleted then remove its fav flag before deleting
    if (snippet.deletedAt === null && snippet.favorite)
      snippet.favorite = false;
    snippet.deletedAt = snippet.deletedAt ? null : new Date();
    await snippet.save();

    res.status(200).json({
      success: true,
      message: snippet.deletedAt ? "Snippet soft-deleted" : "Snippet restored",
      deletedAt: snippet.deletedAt,
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
    const { title, folder, tags, language, content } = req.body;
    if (!title?.trim() || !language?.trim() || !content?.trim()) {
      res.status(500).json({
        success: false,
        message: "Title, language and content are mandatory fields",
      });
    } else {
      const result = await Snippet.create({
        ...req.body,
        folderId: folder,
        tagIds: tags.map(
          (each: { value: string; label: string }) =>
            new Types.ObjectId(each.value)
        ),
        createdBy: userId,
      }).then((result) => {
        res.status(200).json({
          success: true,
          message: { id: result?._id },
        });
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

    const updatedSnippet = await Snippet.findOneAndUpdate(
      { _id: id, createdBy: userId },
      {
        title,
        description,
        folderId: folder,
        tagIds: tags.map(
          (each: { value: string; label: string }) =>
            new Types.ObjectId(each.value)
        ),
        language,
        content,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedSnippet) {
      return res.status(404).json({
        success: false,
        message: "Snippet not found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: { id: updatedSnippet._id },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error updating snippet, Please try again!",
    });
  }
});

export const bulkFavorite = withUser(async (req: Request, res: Response) => {
  setTimeout(async () => {
    try {
      const userId = req.oidc?.user?.sub;
      const { ids, status } = req.body;

      if (ids.length === 0 || typeof status !== "boolean") {
        return res.status(400).json({ success: false, error: "Invalid input" });
      }

      const result = await Snippet.updateMany(
        { _id: { $in: ids }, createdBy: userId, deletedAt: null },
        { $set: { favorite: status } }
      );

      res.status(200).json({
        success: true,
        message: `Snippets marked as ${status ? "favorite" : "unfavorite"}`,
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error updating favorite status" });
    }
  }, 4000);
});

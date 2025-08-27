import { Request, Response } from "express";
import { Folder } from "../models/folder.schema";
import { withUser } from "../utils/withUser";

export const createFolder = withUser(async (req: Request, res: Response) => {
  try {
    const userId = req.oidc?.user?.sub;
    const { name } = req.body;

    const existingFolder = await Folder.findOne({ name, userId });
    if (existingFolder) {
      return res.status(409).json({
        success: false,
        message: "Folder name already exists",
      });
    }

    const result = await Folder.create({
      name,
      userId,
    });
    res.status(200).json({
      success: true,
      data: { id: result?._id },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error creating folder",
    });
  }
});

export const renameFolder = withUser(async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { name: newName } = req.body;
    const userId = req.oidc?.user?.sub;

    if (!newName || newName.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Folder name is required" });
    }

    // Check for duplicate name in other folders
    const existingFolder = await Folder.findOne({
      name: newName.trim(),
      userId,
    });

    console.log(existingFolder);

    if (existingFolder && existingFolder?._id.toString() !== id) {
      return res
        .status(400)
        .json({ success: false, message: "Folder name already exists" });
    }

    // Update using folder id and user id only
    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: id, userId },
      { name: newName.trim() },
      { new: true }
    );

    if (!updatedFolder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Folder renamed successfully",
      data: updatedFolder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error renaming folder, Please try again",
    });
  }
});

export const deleteFolder = withUser(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Folder deleted" });
});

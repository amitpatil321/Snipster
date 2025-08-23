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

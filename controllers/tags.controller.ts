import { Request, Response } from "express";
import { withUser } from "../utils/withUser";
import { Tag } from "../models/tags.schema";

export const getTags = withUser(async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find({});
    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching tags",
    });
  }
});

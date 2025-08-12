import { Request, Response } from "express";
import { Snippet } from "../models/snippet.schema";
import { Tag } from "../models/tags.schema";

export const getSnippet = async (req: Request, res: Response) => {
  // const snippet = await Snippet.find({});
  // res.json(snippet);
  try {
    const userId = req.params.userId;
    const snippets = await Snippet.find({ createdBy: userId })
      .populate({
        path: "tagIds",
        model: Tag,
        select: "name",
      })
      .exec();
    res.json(snippets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
};

export const createSnippet = async (req: Request, res: Response) => {
  console.log(req.body);
};

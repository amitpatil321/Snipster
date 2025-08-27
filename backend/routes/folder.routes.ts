import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  renameFolder,
} from "../controllers/folder.controller";

const router = Router();

router.post("/", createFolder);
router.patch("/rename/:id", renameFolder);
router.delete("/:folderId", deleteFolder);

export default router;

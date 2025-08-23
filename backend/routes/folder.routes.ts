import { Router } from "express";
import { createFolder } from "../controllers/folder.controller";

const router = Router();

router.post("/", createFolder);

export default router;

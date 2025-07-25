import { Router } from "express";
import { createSnippet, getSnippet } from "../controllers/snippet.controller";

const router = Router();

router.get("/", getSnippet);
router.post("/", createSnippet);

export default router;

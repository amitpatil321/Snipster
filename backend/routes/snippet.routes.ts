import { Router } from "express";
import {
  bulkFavorite,
  getCounts,
  getDetails,
  getSnippets,
  saveSnippet,
  toggleFavorite,
  toggleRemove,
  updateSnippet,
} from "../controllers/snippet.controller";

const router = Router();

router.get("/", getSnippets);
router.post("/", saveSnippet);
router.put("/", updateSnippet);
router.patch("/:id/favorite", toggleFavorite);
router.post("/favorites", bulkFavorite);
// we are not using delete method because its a soft delete and not hard delete
router.patch("/:id/trash", toggleRemove);
router.get("/counts", getCounts);
router.get("/details/:id", getDetails);

export default router;

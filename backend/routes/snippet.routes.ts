import { Router } from "express";
import {
  getCounts,
  getDetails,
  getSnippets,
  moveToFolder,
  saveSnippet,
  toggleFavorite,
  toggleRemove,
  updateSnippet,
} from "../controllers/snippet.controller";

const router = Router();

router.get("/", getSnippets);
router.post("/", saveSnippet);
router.put("/", updateSnippet);
router.patch("/favorite", toggleFavorite);
// router.patch("/favorite", (req, res) =>
//   res.status(404).json({
//     success: false,
//     message: "Snippet not found or not authorized",
//   })
// );
// we are not using delete method because its a soft delete and not hard delete
router.patch("/delete", toggleRemove);
router.patch("/folder", moveToFolder);
router.get("/counts", getCounts);
router.get("/details/:id", getDetails);

export default router;

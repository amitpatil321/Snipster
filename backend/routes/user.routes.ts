import { Router } from "express";
import { getFolders } from "../controllers/user.controller";
// import { requiresAuth } from "express-openid-connect";

const router = Router();

router.get("/", (req, res) => {
  if (req.oidc?.user) {
    res.json({ success: true, data: req.oidc?.user });
  } else {
    res.status(401).json({ success: false, message: "User not authenticated" });
  }
});

router.get("/folders", getFolders);

export default router;

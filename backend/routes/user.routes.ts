import { Router } from "express";
// import { requiresAuth } from "express-openid-connect";

const router = Router();

router.get("/", (req, res) => {
  if (req.oidc.user) {
    res.json(req.oidc.user);
    // res.json({
    //   id: req.oidc.user.sub,
    //   name: req.oidc.user.name,
    //   email: req.oidc.user.email,
    //   picture: req.oidc.user.picture,
    // });
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

export default router;

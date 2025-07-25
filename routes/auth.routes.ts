import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.oidc.login({
    returnTo: process.env.REACT_APP_URL,
  });
});

router.get("/logout", (req, res) => {
  res.oidc.logout({ returnTo: process.env.REACT_APP_URL });
});

export default router;

import { Request, Response, Router } from "express";

const router = Router();

router.get("/login", (req: Request, res: Response) => {
  res.oidc.login({
    returnTo: `${process.env.REACT_APP_URL}/all`,
  });
});

router.get("/logout", (req: Request, res: Response) => {
  res.oidc.logout({ returnTo: process.env.REACT_APP_URL });
});

export default router;

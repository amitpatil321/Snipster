import { Request, Response, Router } from "express";

const router = Router();

router.get("/login", (req: Request, res: Response) => {
  res.oidc.login({
    returnTo: process.env.REACT_APP_URL,
  });
});

router.get("/logout", (req: Request, res: Response) => {
  res.oidc.logout({ returnTo: process.env.REACT_APP_URL });
});

router.get("/session", (req: Request, res: Response) => {
  console.log(req.oidc?.user, JSON.stringify(req.oidc?.user));
  res.status(200).json({ success: true, data: req.oidc?.user });
});

export default router;

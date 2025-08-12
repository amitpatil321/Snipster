import { Request, Response } from "express";

export const withUser =
  (handler: (req: Request, res: Response, userId: string) => Promise<any>) =>
  async (req: Request, res: Response) => {
    const userId = req.oidc?.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return handler(req, res, userId);
  };

import type { NextFunction, Request, Response } from "express";

export function requireAuthJson() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.oidc?.isAuthenticated()) {
      return next();
    }

    return res.status(401).json({ success: false, message: "Unauthorized" });
  };
}

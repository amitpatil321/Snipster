import { RequestContext } from "express-openid-connect";

declare module "express-serve-static-core" {
  interface Request {
    oidc?: RequestContext;
  }
}

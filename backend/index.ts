import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { auth } from "express-openid-connect";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";

dotenv.config();

if (!process.env.PORT) {
  console.log("Missing env file or missing port number");
  process.exit(1);
}

import { config } from "./config/auth";
import { rateLimitConfig } from "./config/ratelimitConfig";
import { requireAuthJson } from "./middlewares/requireAuthJson";
import authRoutes from "./routes/auth.routes";
import folderRoutes from "./routes/folder.routes";
import snippetRoutes from "./routes/snippet.routes";
import tagRoutes from "./routes/tags.routes";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// const delayResponse = (delayTime: number) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const originalSend = res.send.bind(res);
//     res.send = function (body?: any): Response {
//       setTimeout(() => {
//         originalSend(body);
//       }, delayTime);
//       return res;
//     };
//     next();
//   };
// };

// app.use(delayResponse(2000));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(rateLimitConfig);
app.use(
  cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(auth(config)); // auth0 router attaches /login, /logout, and /callback routes to the baseURL
app.use(compression());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/api/snippet", requireAuthJson(), snippetRoutes);
app.use("/api/user", requireAuthJson(), userRoutes);
app.use("/api/tags", requireAuthJson(), tagRoutes);
app.use("/api/folder", requireAuthJson(), folderRoutes);

app.get("/", async (req: Request, res: Response) => {
  const user = req.oidc.user ? "Logged in as: " + req.oidc.user.name : "";
  res.send(`<h2>Snipster API</h2>` + user);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "404 - Route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

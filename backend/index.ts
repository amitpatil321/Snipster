import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { auth, requiresAuth } from "express-openid-connect";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";

dotenv.config();

if (!process.env.PORT) {
  console.log("Missing env file or missing port number");
  process.exit(1);
}

import authRoutes from "./routes/auth.routes";
import snippetRoutes from "./routes/snippet.routes";
import tagRoutes from "./routes/tags.routes";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.API_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  authorizationParams: {
    response_type: "code",
  },
  session: {
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use Secure flag only in production (HTTPS)
      httpOnly: true,
      sameSite: "Lax",
    },
  },
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 48,
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(limiter);
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
app.use("/api/snippet", requiresAuth(), snippetRoutes);
app.use("/api/user", requiresAuth(), userRoutes);
app.use("/api/tags", requiresAuth(), tagRoutes);

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

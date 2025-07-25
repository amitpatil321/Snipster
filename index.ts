import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import { auth, requiresAuth } from "express-openid-connect";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import snippetRoutes from "./routes/snippet.routes";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
dotenv.config();

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

app.use(
  cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(auth(config)); // auth router attaches /login, /logout, and /callback routes to the baseURL

app.use("/auth", authRoutes);
app.use("/api/snippet", requiresAuth(), snippetRoutes);
app.use("/api/user", requiresAuth(), userRoutes);

app.get("/", async (req: Request, res: Response) => {
  const user = req.oidc.user ? "Logged in as: " + req.oidc.user.name : "";
  res.send(`<h2>Snipster API</h2>` + user);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

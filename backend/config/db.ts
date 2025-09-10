import mongoose from "mongoose";

const MONGO_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/snipster";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

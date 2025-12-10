import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// optional: test root
app.get("/", (req, res) => {
  res.send("Chat backend running");
});

export default app;

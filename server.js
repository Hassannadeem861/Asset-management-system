import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.mjs";
import redis from './config/redis.js';


const app = express();

connectDB();

const corsOptions = {
  // origin: "http://localhost:8081",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/redis", async (req, res) => {
  try {
    await redis.set("message", "Hello from Redis!");
    const message = await redis.get("message");
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: "Redis Error", details: error.message });
  }
});

import adminAuthRouter from "./routes/admin-auth-route.js";
import userAuthRouter from "./routes/user-auth-route.js";
import roleRouter from "./routes/role-route.js";
import categoryRoute from "./routes/category-route.js";
import locationRoute from "./routes/location-route.js";
import assetRoute from "./routes/asset-route.js";
import historyRoute from "./routes/history-route.js";
import transferHistoryRoute from "./routes/transfer-history-route.js";
import repairRoute from "./routes/repair-route.js";

app.use("/api/v1/admin", adminAuthRouter);
app.use("/api/v1/user", userAuthRouter);
app.use("/api/v1", roleRouter);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", locationRoute);
app.use("/api/v1", assetRoute);
app.use("/api/v1", historyRoute);
app.use("/api/v1", transferHistoryRoute);
app.use("/api/v1", repairRoute);

app.get("/", (req, res) => {
  try {
    console.log("Hello")
  } catch (error) {
    console.log("Error", error)
  }
  res.json({ message: "Welcome to hassan and khalid application." });
});


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
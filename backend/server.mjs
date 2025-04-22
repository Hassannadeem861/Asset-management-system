import express from "express";
import cors from "cors";
import morgan from "morgan";
// import errorMidleWare from "./middle-ware/error.middleware.mjs";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.mjs";
import redis from './config/redis.mjs';


const app = express();

connectDB();

// CORS options
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
import checkinCheckoutRoute from "./routes/checkin-checkout-route.js";
import transferHistoryRoute from "./routes/transfer-history-route.js";
import repairRoute from "./routes/repair-route.js";

app.use("/api/v1/admin", adminAuthRouter);
app.use("/api/v1/user", userAuthRouter);
app.use("/api/v1", roleRouter);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", locationRoute);
app.use("/api/v1", assetRoute);
app.use("/api/v1", checkinCheckoutRoute);
app.use("/api/v1", transferHistoryRoute);
app.use("/api/v1", repairRoute);


// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to hassan nadeem application." });
});

// Set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
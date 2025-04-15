import express from "express";
import cors from "cors";
import morgan from "morgan";
// import errorMidleWare from "./middle-ware/error.middleware.mjs";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.mjs";


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

import authRouter from "./routes/auth-route.mjs";
import roleRouter from "./routes/role-route.mjs";
import categoryRoute from "./routes/category-route.js";
import locationRoute from "./routes/location-route.js";
import assetRoute from "./routes/asset-route.js";

app.use("/api/v1", authRouter);
app.use("/api/v1", roleRouter);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", assetRoute);


// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to hassan nadeem application." });
});

// Set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
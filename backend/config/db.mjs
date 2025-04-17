import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const mongodbURI = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbURI);
    console.log("Database is connected");
  } catch (err) {
    console.error("Mongoose connection error: ", err);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose is disconnected");
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("App is terminating");
  mongoose.connection.close(() => {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});

export default connectDB;
import express from "express";
import {
  register,
  login,
  logout,
  getAllUsers,
  updateUser,
  deleteUser,
  getProfile,
  updatePassword,
  forgetPassword,
  resetPassword
} from "../controllers/auth.mjs";
import { authMiddleware } from "../middleware/auth-middleware.mjs";
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/get-all-users", authMiddleware, getAllUsers);
router.put("/update-user/:id", authMiddleware, updateUser);
router.delete("/delete-user/:id", authMiddleware, deleteUser);
router.get("/get-profile", authMiddleware, getProfile);
router.put("/update-password/:id", authMiddleware, updatePassword);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);


export default router;

import express from "express";
import {
  register,
  login,
  logout,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getProfile,
  updatePassword,
  forgetPassword,
  resetPassword
} from "../controllers/user-auth-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/get-all-users", getAllUsers);
router.get("/get-single-user", getSingleUser);
router.put("/update-user/:id", authMiddleware, updateUser);
router.delete("/delete-user/:id", authMiddleware, deleteUser);
router.get("/get-profile", authMiddleware, getProfile);
router.put("/update-password/:id", authMiddleware, updatePassword);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);


export default router;

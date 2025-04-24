import express from "express";
import { getAllHistory, getSingleHistory, deleteHistory } from "../controllers/history-controller.js";

const router = express.Router();

router.get("/get-all-history", getAllHistory);
router.get("/get-single-history/:id", getSingleHistory);
router.delete("/delete-history/:id", deleteHistory);

export default router;

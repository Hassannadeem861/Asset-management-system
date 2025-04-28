import express from "express";
import { getAllHistory, getSingleHistory, getSingleAssetHistory, deleteHistory } from "../controllers/history-controller.js";

const router = express.Router();

router.get("/get-all-history", getAllHistory);
router.get("/get-single-history/:id", getSingleHistory);
router.get('/get-single-asset-history/:assetId', getSingleAssetHistory);
router.delete("/delete-history/:id", deleteHistory);

export default router;

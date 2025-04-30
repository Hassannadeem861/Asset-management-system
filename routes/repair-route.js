import express from 'express';
import { createRepair, getAllRepairs, getRepairById, updateRepair, deleteRepair } from '../controllers/repair-controller.js';
const router = express.Router();
import { authMiddleware } from "../middleware/auth-middleware.js"

router.post("/create-repair", authMiddleware, createRepair);
router.get("/get-all-repair-records", authMiddleware, getAllRepairs);
router.get("/get-single-repair-record/:id", authMiddleware, getRepairById);
router.put("/update-repair-record/:id", authMiddleware, updateRepair);
router.delete("/delete-repair-record/:id", authMiddleware, deleteRepair);




export default router;
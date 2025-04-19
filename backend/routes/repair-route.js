import express from 'express';
import { createRepair, getAllRepairs, getRepairById, updateRepair, deleteRepair } from '../controllers/repair-controller.js';
const router = express.Router();

router.post("/create-repair", createRepair);
router.get("/get-all-repair-records", getAllRepairs);
router.get("/get-single-repair-record/:id", getRepairById);
router.put("/update-repair-record/:id", updateRepair);
router.delete("/delete-repair-record/:id", deleteRepair);




export default router;
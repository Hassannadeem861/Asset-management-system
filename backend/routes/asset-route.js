import express from 'express';
import { createAsset, getAllAsset, getSingleAsset, updateAsset, deleteAsset, assignAsset } from '../controllers/asset-controller.js';
const router = express.Router();


router.post('/create-asset', createAsset);
router.get('/get-all-asset', getAllAsset);
router.get('/get-single-asset/:id', getSingleAsset);
router.put('/update-asset/:id', updateAsset);
router.delete('/delete-asset/:id', deleteAsset);
router.put('/assign-asset/:id', assignAsset);



export default router;
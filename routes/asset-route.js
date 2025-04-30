import express from 'express';
import { createAsset, getAllAsset, getSingleAsset, updateAsset, deleteAsset, getFilterData, searchAssets, uploadBulkAssets, checkInAsset, checkOutAsset } from '../controllers/asset-controller.js';
import { authMiddleware, adminMiddleWare } from '../middleware/auth-middleware.js'
const router = express.Router();


router.post('/create-asset', authMiddleware, createAsset);
router.post('/upload-bulk-asset', authMiddleware, uploadBulkAssets);
router.post('/checkin-asset/:assetId', authMiddleware, checkInAsset);
router.post('/checkout-asset/:assetId', authMiddleware, checkOutAsset);
router.get('/get-all-asset', authMiddleware, getAllAsset);
router.get('/get-single-asset/:id', authMiddleware, getSingleAsset);
router.get('/get-filter-data', authMiddleware, getFilterData);
router.get('/search-data', authMiddleware, searchAssets);
router.put('/update-asset/:id', authMiddleware, updateAsset);
router.delete('/delete-asset/:id', authMiddleware, deleteAsset);



export default router;
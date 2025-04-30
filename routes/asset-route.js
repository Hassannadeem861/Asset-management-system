import express from 'express';
import { createAsset, getAllAsset, getSingleAsset, updateAsset, deleteAsset, getFilterData, searchAssets, uploadBulkAssets, checkInAsset, checkOutAsset } from '../controllers/asset-controller.js';
import { authMiddleware, adminMiddleWare } from '../middleware/auth-middleware.js'
const router = express.Router();


router.post('/create-asset', authMiddleware, adminMiddleWare, createAsset);
router.post('/upload-bulk-asset', authMiddleware, adminMiddleWare, uploadBulkAssets);
router.post('/checkin-asset/:assetId', authMiddleware, adminMiddleWare, checkInAsset);
router.post('/checkout-asset/:assetId', authMiddleware, adminMiddleWare, checkOutAsset);
router.get('/get-all-asset', authMiddleware, adminMiddleWare, getAllAsset);
router.get('/get-single-asset/:id', authMiddleware, adminMiddleWare, getSingleAsset);
router.get('/get-filter-data', authMiddleware, adminMiddleWare, getFilterData);
router.get('/search-data', authMiddleware, adminMiddleWare, searchAssets);
router.put('/update-asset/:id', authMiddleware, adminMiddleWare, updateAsset);
router.delete('/delete-asset/:id', authMiddleware, adminMiddleWare, deleteAsset);



export default router;
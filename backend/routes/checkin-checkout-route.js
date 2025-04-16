import express from 'express';
import { checkinAsset, checkoutAsset, getCheckinCheckoutRecords } from '../controllers/checkin-checkout-controller.js';
const router = express.Router();


router.post('/create-checkin/:assetId', checkinAsset);
router.post('/create-checkout/:assetId', checkoutAsset);
router.get('/get-all-records', getCheckinCheckoutRecords);



export default router;
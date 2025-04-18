import express from 'express';
import { checkinAsset, checkoutAsset, getCheckinCheckoutRecords, getSingleCheckinCheckoutRecord, updateCheckinCheckoutRecord, deleteCheckinCheckoutRecord } from '../controllers/checkin-checkout-controller.js';
const router = express.Router();


router.post('/create-checkin/:assetId', checkinAsset);
router.post('/create-checkout/:assetId', checkoutAsset);
router.get('/get-all-records', getCheckinCheckoutRecords);
router.get('/get-single-records/:id', getSingleCheckinCheckoutRecord);
router.put('/update-records/:id', updateCheckinCheckoutRecord);
router.delete('/delete-records/:id', deleteCheckinCheckoutRecord);



export default router;
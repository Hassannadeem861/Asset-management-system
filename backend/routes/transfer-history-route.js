import express from 'express';
import {
    createTransfer,
    getAllTransfers,
    getTransferById,
    updateTransfer,
    deleteTransfer
} from '../controllers/transferHistory-controller.js';

const router = express.Router();

router.post('/create-transfer-history/:id', createTransfer);
router.get('/get-all-transfers-history', getAllTransfers);
router.get('get-single-transfer-history/:id', getTransferById);
router.put('update-transfer-history/:id', updateTransfer);
router.delete('delete-transfer-history/:id', deleteTransfer);

export default router;

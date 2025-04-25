import express from 'express';
import { createCategory, getAllCategory, getSingleCategory, updateAsset, deleteAsset } from '../controllers/category-controller.js';
const router = express.Router();


router.post('/create-category', createCategory);
router.get('/get-all-category', getAllCategory);
router.get('/get-single-category/:id', getSingleCategory);
router.put('/update-category/:id', updateAsset);
router.delete('/delete-category/:id', deleteAsset);



export default router;
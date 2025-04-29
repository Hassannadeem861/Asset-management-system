import express from 'express';
import { createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory } from '../controllers/category-controller.js';
const router = express.Router();


router.post('/create-category', createCategory);
router.get('/get-all-category', getAllCategory);
router.get('/get-single-category/:id', getSingleCategory);
router.put('/update-category/:id', updateCategory);
router.delete('/delete-category/:id', deleteCategory);



export default router;
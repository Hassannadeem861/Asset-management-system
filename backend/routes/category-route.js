import express from 'express';
import { createCategory, getAllCategory } from '../controllers/category-controller.js';
const router = express.Router();


router.post('/create-category', createCategory);
router.get('/get-all-category', getAllCategory);



export default router;
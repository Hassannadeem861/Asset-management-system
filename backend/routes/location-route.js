import express from 'express';
import { createLocation, getAllLocation } from '../controllers/location-controller.js';
const router = express.Router();


router.post('/create-location', createLocation);
router.get('/get-all-location', getAllLocation);




export default router;
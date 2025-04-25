import express from 'express';
import { createLocation, getAllLocation, getSingleLocation, updateLocation, deleteLocation } from '../controllers/location-controller.js';
const router = express.Router();


router.post('/create-location', createLocation);
router.get('/get-all-location', getAllLocation);
router.get('/get-single-location/:id', getSingleLocation);
router.put('/update-location/:id', updateLocation);
router.delete('/delete-location/:id', deleteLocation);




export default router;
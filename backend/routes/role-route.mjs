import express from 'express';
import { seedRoles, assignRole } from '../controllers/role.mjs';
const router = express.Router();


// Create resume (admin and manager can create)
router.post('/create-role', seedRoles);

// Role assign karne ka API endpoint
router.post('/assign-role', assignRole);



export default router;
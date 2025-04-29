import express from 'express';
import { seedRoles, assignRole } from '../controllers/role-controller.js';
const router = express.Router();


router.post('/create-role', seedRoles);
router.post('/assign-role', assignRole);



export default router;
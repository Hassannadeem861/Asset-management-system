import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware.mjs';  // Token-based authentication middleware
import { authorizePermissions } from '../middleware/authorizePermissions-middleware.mjs';
import { createResume, readResumes, updateResume, deleteResume, updateResumeImage } from '../controllers/resume.mjs';
import { upload } from '../middleware/multer-middleware.mjs';


const uploadMiddleware = upload.fields([
    { name: "resumeImage", maxCount: 1 },
    // { name: "pdfUpdate", maxCount: 1 },
    // { name: "epubUpload", maxCount: 1 },
    // { name: "kindleMobiUpload", maxCount: 1 },
]);

const router = express.Router();

// Create resume (admin and manager can create)
router.post('/create-resume', uploadMiddleware, authMiddleware, authorizePermissions(['create']), createResume);

// Read resumes (everyone can read)
router.get('/get-all-resume', authMiddleware, authorizePermissions(['read']), readResumes);

// Update resume (admin and manager can update)
router.put('/update-resume/:id', authMiddleware, authorizePermissions(['update']), updateResume);

router.put('/update-resume-image/:id', uploadMiddleware, authMiddleware, authorizePermissions(['update']), updateResumeImage);

// Delete resume (only admin can delete)
router.delete('/delete-resume/:id', authMiddleware, authorizePermissions(['delete']), deleteResume);
// router.delete('/delete-resume/:id', authenticate, authorizePermissions(['delete']), deleteResume);

export default router;

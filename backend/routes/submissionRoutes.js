import express from 'express';
import {
  uploadVideo,
  createSubmission,
  getSubmissions,
  reviewSubmission
} from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth protect middleware
router.use(protect);

router.post('/upload-video', authorize('parent'), uploadVideo);
router.post('/', authorize('parent'), createSubmission);
router.get('/', getSubmissions);
router.put('/:id/review', authorize('Admin', 'Clinician', 'doctor'), reviewSubmission);

export default router;

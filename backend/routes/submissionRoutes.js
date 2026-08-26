import express from 'express';
import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  reviewSubmission,
  deleteSubmission,
  streamRecording,
} from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public/direct media streaming route
router.get('/stream/:filename', streamRecording);

// Require authentication for all submission management routes
router.use(protect);

router
  .route('/')
  .post(authorize('parent', 'Admin'), createSubmission)
  .get(getSubmissions);

router
  .route('/:id')
  .get(getSubmissionById)
  .delete(deleteSubmission);

router
  .route('/:id/review')
  .patch(authorize('Clinician', 'doctor', 'Admin'), reviewSubmission);

export default router;

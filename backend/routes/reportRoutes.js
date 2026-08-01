import express from 'express';
import { body } from 'express-validator';
import {
  generateReport,
  getReport,
  updateReport,
  deleteReport,
  generateAIReport,
  getReports,
  shareReport,
} from '../controllers/reportController.js';
import { getRecentReports } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

const reportValidation = [
  body('assessmentId').notEmpty().withMessage('Assessment ID reference is required'),
];

router.post(
  '/generate',
  protect,
  authorize('Admin', 'Clinician', 'doctor'),
  reportValidation,
  validateRequest,
  generateReport
);

router.post(
  '/generate-ai',
  protect,
  authorize('Admin', 'Clinician', 'doctor'),
  reportValidation,
  validateRequest,
  generateAIReport
);

router.get('/', protect, getReports);
router.get('/:id', protect, getReport);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, authorize('Admin', 'Clinician', 'doctor'), deleteReport);

router.post(
  '/:id/share',
  protect,
  authorize('Admin', 'Clinician', 'doctor'),
  shareReport
);

export default router;

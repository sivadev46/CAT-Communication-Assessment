import express from 'express';
import { body } from 'express-validator';
import {
  createAssessment,
  getAssessment,
  getAssessmentsByPatient,
  updateAssessment,
  deleteAssessment,
} from '../controllers/assessmentController.js';
import { getRecentAssessments } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

const assessmentValidation = [
  body('patientId').notEmpty().withMessage('Patient ID reference is required'),
];

router.post(
  '/',
  protect,
  authorize('Admin', 'Clinician', 'doctor'),
  assessmentValidation,
  validateRequest,
  createAssessment
);

router.get('/', protect, getRecentAssessments);
router.get('/patient/:patientId', protect, getAssessmentsByPatient);
router.get('/:id', protect, getAssessment);
router.put('/:id', protect, updateAssessment);
router.delete('/:id', protect, authorize('Admin', 'Clinician'), deleteAssessment);

export default router;

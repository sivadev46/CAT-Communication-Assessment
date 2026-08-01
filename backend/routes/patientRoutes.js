import express from 'express';
import { body } from 'express-validator';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

const patientValidation = [
  body('fullName').trim().notEmpty().withMessage('Patient full name is required'),
  body('age').notEmpty().withMessage('Age is required'),
  body('diagnosis').trim().notEmpty().withMessage('Clinical diagnosis is required'),
];

// Patient Routes
router.post(
  '/',
  protect,
  authorize('Admin', 'Clinician'),
  patientValidation,
  validateRequest,
  createPatient
);

router.get('/', protect, getAllPatients);
router.get('/search', protect, getAllPatients);
router.get('/filter', protect, getAllPatients);

router.get('/:id', protect, getPatientById);
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, authorize('Admin', 'Clinician'), deletePatient);

export default router;

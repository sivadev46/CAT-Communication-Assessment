import express from 'express';
import {
  getDashboardStats,
  getRecentPatients,
  getRecentAssessments,
  getRecentReports,
  getActivityTimeline,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Restrict all dashboard endpoints to clinical staff
router.use(protect, authorize('Admin', 'Clinician', 'doctor'));

router.get('/stats', getDashboardStats);
router.get('/recent-patients', getRecentPatients);
router.get('/recent-assessments', getRecentAssessments);
router.get('/recent-reports', getRecentReports);
router.get('/activity', getActivityTimeline);

export default router;

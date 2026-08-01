import express from 'express';
import {
  getDashboardStats,
  getRecentPatients,
  getRecentAssessments,
  getRecentReports,
  getActivityTimeline,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/recent-patients', protect, getRecentPatients);
router.get('/recent-assessments', protect, getRecentAssessments);
router.get('/recent-reports', protect, getRecentReports);
router.get('/activity', protect, getActivityTimeline);

export default router;

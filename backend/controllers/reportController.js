import Report from '../models/Report.js';
import Assessment from '../models/Assessment.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Generate new report for an assessment
// @route   POST /api/reports
// @access  Private (Clinician/Admin)
export const generateReport = asyncHandler(async (req, res) => {
  const {
    assessmentId,
    clinicalReport,
    caregiverReport,
    recommendations,
    strengths,
    areasForImprovement,
  } = req.body;

  // Verify assessment exists
  const assessment = await Assessment.findById(assessmentId).populate('patient');
  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: 'Assessment reference not found for generating report',
      data: null,
    });
  }

  // Create report document
  const report = await Report.create({
    assessment: assessmentId,
    clinicalReport: clinicalReport || {
      summary: `Clinical assessment for ${assessment.patient?.fullName || 'Patient'} completed on ${new Date(assessment.assessmentDate).toLocaleDateString()}.`,
      domainBreakdown: {
        eyeContact: assessment.eyeContact,
        jointAttention: assessment.jointAttention,
        receptiveLanguage: assessment.receptiveLanguage,
        expressiveLanguage: assessment.expressiveLanguage,
        socialInteraction: assessment.socialInteraction,
      },
      overallScore: assessment.overallScore,
    },
    caregiverReport: caregiverReport || {
      summary: `Actionable home communication guide for caregiver of ${assessment.patient?.fullName || 'Patient'}.`,
      homeStrategies: [
        'Maintain direct eye contact during daily routine commands',
        'Use visual cue boards for joint attention exercises',
        'Provide positive reinforcement during turn-taking games',
      ],
    },
    recommendations: recommendations || [
      'Bi-weekly Speech-Language Therapy sessions focusing on expressive syntax.',
      'VR Interactive Scenarios practice for social engagement in group settings.',
    ],
    strengths: strengths || [
      'High joint attention response rate in structured environments.',
      'Strong receptive vocabulary comprehension.',
    ],
    areasForImprovement: areasForImprovement || [
      'Expressive language turn-taking in noisy peer group settings.',
      'Sustained eye contact during multi-step clinical instructions.',
    ],
    generatedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Report generated successfully (PDF-ready response structure)',
    data: report,
  });
});

// @desc    Get report by ID or assessment ID
// @route   GET /api/reports/:id
// @access  Private
export const getReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Allow lookup by report ID or assessment ID
  let report = await Report.findById(id)
    .populate({
      path: 'assessment',
      populate: { path: 'patient clinician' },
    })
    .populate('generatedBy', 'fullName email role');

  if (!report) {
    report = await Report.findOne({ assessment: id })
      .populate({
        path: 'assessment',
        populate: { path: 'patient clinician' },
      })
      .populate('generatedBy', 'fullName email role');
  }

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report record not found',
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Report details retrieved successfully',
    data: report,
  });
});

// @desc    Update report details
// @route   PUT /api/reports/:id
// @access  Private
export const updateReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let report = await Report.findById(id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report record not found',
      data: null,
    });
  }

  report = await Report.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Report updated successfully',
    data: report,
  });
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (Admin/Clinician)
export const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await Report.findById(id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report record not found',
      data: null,
    });
  }

  await report.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Report deleted successfully',
    data: null,
  });
});

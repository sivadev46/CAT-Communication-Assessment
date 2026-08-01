import Report from '../models/Report.js';
import Assessment from '../models/Assessment.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { geminiService } from '../services/geminiService.js';

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
    patientId: assessment.patient?._id || assessment.patient,
    doctorId: req.user._id,
    clinicalReport: clinicalReport || {
      summary: `Speech-Language Pathologist diagnostic evaluation for ${assessment.patient?.fullName || 'Patient'} based on CAT metrics.`,
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

  // Security authorization check for parents
  if (req.user.role === 'parent') {
    if (!report.shared || !report.parentId || report.parentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report record.',
        data: null,
      });
    }
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

// @desc    Generate new AI-powered report for an assessment using Gemini
// @route   POST /api/reports/generate-ai
// @access  Private (Clinician/Admin)
export const generateAIReport = asyncHandler(async (req, res) => {
  const { assessmentId } = req.body;

  // 1. Verify assessment exists and populate patient details
  const assessment = await Assessment.findById(assessmentId).populate('patient');
  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: 'Assessment reference not found for generating AI report',
      data: null,
    });
  }

  // 2. Parse clinician notes from JSON string if needed
  let notes = {};
  if (assessment.notes) {
    try {
      notes = JSON.parse(assessment.notes);
    } catch {
      // Fallback if notes is a plain string
      notes = { general: assessment.notes };
    }
  }

  let reportData;
  let isAiGenerated = false;

  // 3. Try to call Gemini Service
  try {
    console.log(`[Gemini] Starting AI report generation request for assessment ID: ${assessmentId}`);
    const aiResponse = await geminiService.generateAIReportFromAssessment(
      assessment.patient,
      assessment,
      notes
    );

    if (aiResponse) {
      reportData = {
        assessment: assessmentId,
        patientId: assessment.patient?._id || assessment.patient,
        doctorId: req.user._id,
        clinicalReport: {
          summary: aiResponse.clinicalSummary,
          riskLevel: aiResponse.riskLevel,
          followUpRecommendation: aiResponse.followUpRecommendation,
          domainBreakdown: {
            eyeContact: assessment.eyeContact,
            jointAttention: assessment.jointAttention,
            receptiveLanguage: assessment.receptiveLanguage,
            expressiveLanguage: assessment.expressiveLanguage,
            socialInteraction: assessment.socialInteraction,
          },
          overallScore: assessment.overallScore || assessment.overallPercentage,
          isAiGenerated: true
        },
        caregiverReport: {
          summary: aiResponse.caregiverSummary,
          homeStrategies: aiResponse.homeStrategies,
          isAiGenerated: true
        },
        recommendations: aiResponse.recommendations,
        strengths: aiResponse.strengths,
        areasForImprovement: aiResponse.areasForImprovement,
        generatedBy: req.user._id,
      };
      isAiGenerated = true;
    }
  } catch (error) {
    console.error(`[Gemini AI Fail Fallback Triggered]. Reason: ${error.message}`);
    // If Gemini fails (e.g. missing API key, rate limit, timeout), implement automatic fallback to the existing traditional manual report generation as requested.
  }

  // 4. Fallback if AI generation failed or wasn't processed
  if (!isAiGenerated) {
    reportData = {
      assessment: assessmentId,
      patientId: assessment.patient?._id || assessment.patient,
      doctorId: req.user._id,
      clinicalReport: {
        summary: "AI report could not be generated at this time. A standard clinical report has been created instead.",
        domainBreakdown: {
          eyeContact: assessment.eyeContact,
          jointAttention: assessment.jointAttention,
          receptiveLanguage: assessment.receptiveLanguage,
          expressiveLanguage: assessment.expressiveLanguage,
          socialInteraction: assessment.socialInteraction,
        },
        overallScore: assessment.overallScore || assessment.overallPercentage,
        isAiGenerated: false,
        fallbackReason: 'AI generation failed or was bypassed'
      },
      caregiverReport: {
        summary: `Actionable home communication guide for caregiver of ${assessment.patient?.fullName || 'Patient'}.`,
        homeStrategies: [
          'Maintain direct eye contact during daily routine commands',
          'Use visual cue boards for joint attention exercises',
          'Provide positive reinforcement during turn-taking games',
        ],
        isAiGenerated: false
      },
      recommendations: [
        'Bi-weekly Speech-Language Therapy sessions focusing on expressive syntax.',
        'VR Interactive Scenarios practice for social engagement in group settings.',
      ],
      strengths: [
        'High joint attention response rate in structured environments.',
        'Strong receptive vocabulary comprehension.',
      ],
      areasForImprovement: [
        'Expressive language turn-taking in noisy peer group settings.',
        'Sustained eye contact during multi-step clinical instructions.',
      ],
      generatedBy: req.user._id,
    };
  }

  // 5. Save the report to the database
  const report = await Report.create(reportData);

  res.status(201).json({
    success: true,
    message: isAiGenerated 
      ? 'AI-powered clinical report generated successfully using Google Gemini.' 
      : 'Report created successfully using default fallback templates due to AI service unavailability.',
    data: report,
    isAiGenerated
  });
});

// @desc    Get all clinical reports
// @route   GET /api/reports
// @access  Private (Clinician/Admin/Parent)
export const getReports = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === 'parent') {
    query = { parentId: req.user._id, shared: true };
  }
  const reports = await Report.find(query)
    .populate({
      path: 'assessment',
      populate: { path: 'patient' },
    })
    .populate('generatedBy', 'fullName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'All reports retrieved successfully',
    data: reports,
  });
});

// @desc    Share report with parent
// @route   POST /api/reports/:id/share
// @access  Private (Clinician/Admin/Doctor)
export const shareReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a parent email address',
      data: null,
    });
  }

  const parent = await User.findOne({ email: email.toLowerCase(), role: 'parent' });
  if (!parent) {
    return res.status(404).json({
      success: false,
      message: 'No parent account registered with this email address.',
      data: null,
    });
  }

  // Find by ID or assessment ID
  let report = await Report.findById(id);
  if (!report) {
    report = await Report.findOne({ assessment: id });
  }

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
      data: null,
    });
  }

  report.parentId = parent._id;
  report.shared = true;
  report.sharedAt = new Date();
  await report.save();

  res.status(200).json({
    success: true,
    message: `Report shared successfully with ${parent.fullName}`,
    data: report,
  });
});



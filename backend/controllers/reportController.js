import Report from '../models/Report.js';
import Assessment from '../models/Assessment.js';
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
    const aiResponse = await geminiService.generateAIReportFromAssessment(
      assessment.patient,
      assessment,
      notes
    );

    if (aiResponse) {
      reportData = {
        assessment: assessmentId,
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
    console.warn(`[Gemini AI Fail Fallback Triggered]: ${error.message}`);
    // If Gemini fails (e.g. missing API key, rate limit, timeout), implement automatic fallback to the existing traditional manual report generation as requested.
  }

  // 4. Fallback if AI generation failed or wasn't processed
  if (!isAiGenerated) {
    reportData = {
      assessment: assessmentId,
      clinicalReport: {
        summary: `Clinical assessment for ${assessment.patient?.fullName || 'Patient'} completed on ${new Date(assessment.createdAt).toLocaleDateString()}. (System Generated Fallback)`,
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
        summary: `Actionable home communication guide for caregiver of ${assessment.patient?.fullName || 'Patient'}. (System Generated Fallback)`,
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


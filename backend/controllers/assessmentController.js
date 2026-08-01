import Assessment from '../models/Assessment.js';
import Patient from '../models/Patient.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Helper to calculate overall average score
const calculateScores = (scores) => {
  const {
    eyeContact = 0,
    jointAttention = 0,
    receptiveLanguage = 0,
    expressiveLanguage = 0,
    socialInteraction = 0,
  } = scores;

  const total =
    Number(eyeContact) +
    Number(jointAttention) +
    Number(receptiveLanguage) +
    Number(expressiveLanguage) +
    Number(socialInteraction);

  const overallScore = Math.round(total / 5);
  const overallPercentage = overallScore; // Percent scale out of 100

  return { overallScore, overallPercentage };
};

// @desc    Create a new assessment
// @route   POST /api/assessments
// @access  Private (Clinician)
export const createAssessment = asyncHandler(async (req, res) => {
  const {
    patientId,
    eyeContact,
    jointAttention,
    receptiveLanguage,
    expressiveLanguage,
    socialInteraction,
    notes,
    status,
    assessmentDate,
  } = req.body;

  // Validate patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Referenced patient record not found',
      data: null,
    });
  }

  // Calculate scores
  const { overallScore, overallPercentage } = calculateScores({
    eyeContact,
    jointAttention,
    receptiveLanguage,
    expressiveLanguage,
    socialInteraction,
  });

  const assessment = await Assessment.create({
    patient: patientId,
    eyeContact: eyeContact || 0,
    jointAttention: jointAttention || 0,
    receptiveLanguage: receptiveLanguage || 0,
    expressiveLanguage: expressiveLanguage || 0,
    socialInteraction: socialInteraction || 0,
    overallScore,
    overallPercentage,
    notes: notes || '',
    status: status || 'Completed',
    assessmentDate: assessmentDate || new Date(),
    clinician: req.user._id,
  });

  // Update patient status to Completed if assessment is done
  if (status === 'Completed' || !status) {
    patient.status = 'Completed';
    await patient.save();
  }

  res.status(201).json({
    success: true,
    message: 'Assessment recorded successfully',
    data: assessment,
  });
});

// @desc    Get assessment details by ID
// @route   GET /api/assessments/:id
// @access  Private
export const getAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const assessment = await Assessment.findById(id)
    .populate('patient', 'patientId fullName age gender diagnosis guardianName')
    .populate('clinician', 'fullName email role');

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: 'Assessment record not found',
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Assessment details retrieved successfully',
    data: assessment,
  });
});

// @desc    Get all assessments for a specific patient
// @route   GET /api/assessments/patient/:patientId
// @access  Private
export const getAssessmentsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const assessments = await Assessment.find({ patient: patientId })
    .populate('clinician', 'fullName email')
    .sort({ assessmentDate: -1 });

  res.status(200).json({
    success: true,
    message: 'Patient assessments retrieved successfully',
    data: {
      count: assessments.length,
      assessments,
    },
  });
});

// @desc    Update assessment record
// @route   PUT /api/assessments/:id
// @access  Private
export const updateAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let assessment = await Assessment.findById(id);

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: 'Assessment record not found',
      data: null,
    });
  }

  const updatedScores = {
    eyeContact: req.body.eyeContact ?? assessment.eyeContact,
    jointAttention: req.body.jointAttention ?? assessment.jointAttention,
    receptiveLanguage: req.body.receptiveLanguage ?? assessment.receptiveLanguage,
    expressiveLanguage: req.body.expressiveLanguage ?? assessment.expressiveLanguage,
    socialInteraction: req.body.socialInteraction ?? assessment.socialInteraction,
  };

  const { overallScore, overallPercentage } = calculateScores(updatedScores);

  const updateData = {
    ...req.body,
    ...updatedScores,
    overallScore,
    overallPercentage,
  };

  assessment = await Assessment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Assessment updated successfully',
    data: assessment,
  });
});

// @desc    Delete assessment record
// @route   DELETE /api/assessments/:id
// @access  Private (Admin/Clinician)
export const deleteAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const assessment = await Assessment.findById(id);

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: 'Assessment record not found',
      data: null,
    });
  }

  await assessment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Assessment deleted successfully',
    data: null,
  });
});

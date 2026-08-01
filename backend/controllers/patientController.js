import Patient from '../models/Patient.js';
import Assessment from '../models/Assessment.js';
import Report from '../models/Report.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Create a new patient record
// @route   POST /api/patients
// @access  Private (Clinician/Admin)
export const createPatient = asyncHandler(async (req, res) => {
  const {
    fullName,
    age,
    gender,
    diagnosis,
    guardianName,
    phoneNumber,
    address,
    dateOfBirth,
    profilePhoto,
    status,
    patientId,
    email,
    notes,
  } = req.body;

  // Validate custom patientId uniqueness if provided
  if (patientId) {
    const existing = await Patient.findOne({ patientId: patientId.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `MRN / Patient ID "${patientId}" is already registered. Please enter a unique identifier.`,
        data: null,
      });
    }
  }

  const patient = await Patient.create({
    fullName,
    age,
    gender,
    diagnosis,
    guardianName,
    phoneNumber,
    address,
    dateOfBirth,
    profilePhoto,
    patientId: patientId ? patientId.trim() : undefined,
    status: status || 'Scheduled',
    email: email || '',
    notes: notes || '',
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Patient record created successfully',
    data: patient,
  });
});

// @desc    Get all patients with pagination, search, and filtering
// @route   GET /api/patients
// @access  Private
export const getAllPatients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const { search, gender, status, sortBy } = req.query;

  // Build query filter
  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { patientId: { $regex: search, $options: 'i' } },
      { diagnosis: { $regex: search, $options: 'i' } },
    ];
  }

  if (gender) {
    query.gender = gender;
  }

  if (status) {
    query.status = status;
  }

  let sortOption = { createdAt: -1 }; // default: newest first
  if (sortBy === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sortBy === 'alpha-asc') {
    sortOption = { fullName: 1 };
  } else if (sortBy === 'alpha-desc') {
    sortOption = { fullName: -1 };
  }

  const total = await Patient.countDocuments(query);
  const patients = await Patient.find(query)
    .populate('createdBy', 'fullName email')
    .sort(sortOption)
    .skip(startIndex)
    .limit(limit);

  // Compute metrics for each patient
  const populatedPatients = await Promise.all(
    patients.map(async (p) => {
      const assessments = await Assessment.find({ patient: p._id }).sort({ assessmentDate: -1 });
      const numAssessments = assessments.length;
      const lastAssessmentDate = numAssessments > 0 ? assessments[0].assessmentDate : null;

      const assessmentIds = assessments.map((a) => a._id);
      const numReports = await Report.countDocuments({ assessment: { $in: assessmentIds } });

      return {
        ...p.toObject(),
        numAssessments,
        lastAssessmentDate,
        numReports,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: 'Patients list retrieved successfully',
    data: {
      total,
      page,
      pages: Math.ceil(total / limit),
      count: patients.length,
      patients: populatedPatients,
    },
  });
});

// @desc    Get patient details by ID or patientId string
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Search by MongoDB _id or string patientId (e.g. PAT-1024)
  const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
  const patient = isMongoId
    ? await Patient.findById(id).populate('createdBy', 'fullName email')
    : await Patient.findOne({ patientId: id }).populate('createdBy', 'fullName email');

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: `Patient record not found for identifier: ${id}`,
      data: null,
    });
  }

  const assessments = await Assessment.find({ patient: patient._id }).sort({ assessmentDate: -1 });
  const numAssessments = assessments.length;
  const lastAssessmentDate = numAssessments > 0 ? assessments[0].assessmentDate : null;

  const assessmentIds = assessments.map((a) => a._id);
  const numReports = await Report.countDocuments({ assessment: { $in: assessmentIds } });

  const patientData = {
    ...patient.toObject(),
    numAssessments,
    lastAssessmentDate,
    numReports,
  };

  res.status(200).json({
    success: true,
    message: 'Patient record retrieved successfully',
    data: patientData,
  });
});

// @desc    Update patient details
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient record not found',
      data: null,
    });
  }

  const { patientId } = req.body;
  if (patientId && patientId.trim() !== patient.patientId) {
    const existing = await Patient.findOne({ patientId: patientId.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `MRN / Patient ID "${patientId}" is already registered to another patient.`,
        data: null,
      });
    }
  }

  patient = await Patient.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Patient record updated successfully',
    data: patient,
  });
});

// @desc    Delete patient record
// @route   DELETE /api/patients/:id
// @access  Private (Admin/Clinician)
export const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient record not found',
      data: null,
    });
  }

  // Restrict deletion if assessments or reports exist
  const assessmentsCount = await Assessment.countDocuments({ patient: id });
  if (assessmentsCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete patient because ${assessmentsCount} assessment record(s) and related clinical reports exist in the database. Deleting this patient would result in orphaned records.`,
      data: null,
    });
  }

  await patient.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Patient record deleted successfully',
    data: null,
  });
});

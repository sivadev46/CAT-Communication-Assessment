import Patient from '../models/Patient.js';
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
  } = req.body;

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
    status: status || 'Scheduled',
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

  const { search, gender, status } = req.query;

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

  const total = await Patient.countDocuments(query);
  const patients = await Patient.find(query)
    .populate('createdBy', 'fullName email')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: 'Patients list retrieved successfully',
    data: {
      total,
      page,
      pages: Math.ceil(total / limit),
      count: patients.length,
      patients,
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

  res.status(200).json({
    success: true,
    message: 'Patient record retrieved successfully',
    data: patient,
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

  await patient.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Patient record deleted successfully',
    data: null,
  });
});

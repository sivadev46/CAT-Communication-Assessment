import fs from 'fs';
import path from 'path';
import Submission from '../models/Submission.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Upload raw video blob to public uploads folder
// @route   POST /api/submissions/upload-video
// @access  Private (Parent)
export const uploadVideo = asyncHandler(async (req, res) => {
  const uploadsDir = path.join(process.cwd(), 'backend', 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `recording-${Date.now()}-${Math.round(Math.random() * 1e9)}.webm`;
  const filepath = path.join(uploadsDir, filename);

  const fileStream = fs.createWriteStream(filepath);
  req.pipe(fileStream);

  req.on('end', () => {
    res.status(200).json({
      success: true,
      message: 'Video upload completed successfully',
      videoUrl: `/uploads/${filename}`
    });
  });

  req.on('error', (err) => {
    console.error('[Upload Error] Failed to save video stream:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to write video stream to disk'
    });
  });
});

// @desc    Create new practice submission record
// @route   POST /api/submissions
// @access  Private (Parent)
export const createSubmission = asyncHandler(async (req, res) => {
  const {
    patientId,
    clinicianId,
    assessmentId,
    reportId,
    activityName,
    videoUrl,
    duration
  } = req.body;

  if (!patientId || !clinicianId || !activityName || !videoUrl || duration === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide patientId, clinicianId, activityName, videoUrl, and duration'
    });
  }

  const submission = await Submission.create({
    patientId,
    parentId: req.user._id,
    clinicianId,
    assessmentId: assessmentId || null,
    reportId: reportId || null,
    activityName,
    videoUrl,
    duration,
    status: 'Sent'
  });

  res.status(201).json({
    success: true,
    message: 'Practice recording shared with clinician successfully',
    data: submission
  });
});

// @desc    Get submissions based on role (parent or clinician)
// @route   GET /api/submissions
// @access  Private
export const getSubmissions = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role === 'parent') {
    query = { parentId: req.user._id };
  } else {
    // Clinician/doctor role
    query = { clinicianId: req.user._id };
  }

  const submissions = await Submission.find(query)
    .populate('patientId', 'fullName patientId age gender diagnosis')
    .populate('parentId', 'fullName email')
    .populate('clinicianId', 'fullName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Submissions retrieved successfully',
    data: submissions
  });
});

// @desc    Review a submission
// @route   PUT /api/submissions/:id/review
// @access  Private (Clinician)
export const reviewSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await Submission.findById(id);
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }

  // Authorization check
  if (submission.clinicianId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to review this submission'
    });
  }

  submission.status = 'Reviewed';
  submission.reviewedAt = new Date();
  await submission.save();

  res.status(200).json({
    success: true,
    message: 'Submission marked as reviewed',
    data: submission
  });
});

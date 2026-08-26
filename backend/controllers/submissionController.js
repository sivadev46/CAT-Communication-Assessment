import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import Submission from '../models/Submission.js';
import Patient from '../models/Patient.js';
import Report from '../models/Report.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const RECORDINGS_DIR = path.join(process.cwd(), 'backend', 'uploads', 'recordings');

// Ensure recordings directory exists on disk
const ensureRecordingsDir = async () => {
  try {
    await fs.mkdir(RECORDINGS_DIR, { recursive: true });
  } catch (err) {
    console.error('[Uploads] Error creating recordings directory:', err.message);
  }
};

// @desc    Create and upload a new practice recording submission
// @route   POST /api/submissions
// @access  Private (Parent/Admin)
export const createSubmission = asyncHandler(async (req, res) => {
  const {
    patientId,
    clinicianId,
    assessmentId,
    reportId,
    activityId,
    activityTitle,
    activityCategory,
    duration,
    formattedDuration,
    notes,
    videoBase64,
    videoUrl: directVideoUrl,
  } = req.body;

  let resolvedParentId = req.user._id;
  let resolvedClinicianId = clinicianId;
  let resolvedPatientId = patientId;
  let resolvedAssessmentId = assessmentId || null;
  let resolvedReportId = reportId || null;

  // 1. Resolve relationships from Report if provided
  if (resolvedReportId) {
    const report = await Report.findById(resolvedReportId).populate('assessment');
    if (report) {
      if (!resolvedClinicianId) {
        resolvedClinicianId = report.doctorId || report.generatedBy;
      }
      if (!resolvedPatientId) {
        resolvedPatientId = report.patientId || report.assessment?.patient;
      }
      if (!resolvedAssessmentId && report.assessment) {
        resolvedAssessmentId = report.assessment._id || report.assessment;
      }
    }
  }

  // 2. Resolve clinician from Patient's creator if still missing
  if (resolvedPatientId && !resolvedClinicianId) {
    const patient = await Patient.findById(resolvedPatientId);
    if (patient && patient.createdBy) {
      resolvedClinicianId = patient.createdBy;
    }
  }

  // 3. Fallback to active clinician user if not found
  if (!resolvedClinicianId) {
    const defaultClinician = await User.findOne({ role: { $in: ['Clinician', 'doctor'] } });
    if (defaultClinician) {
      resolvedClinicianId = defaultClinician._id;
    } else {
      resolvedClinicianId = req.user._id;
    }
  }

  // 4. Resolve default patient if not supplied
  if (!resolvedPatientId) {
    const defaultPatient = await Patient.findOne();
    if (defaultPatient) {
      resolvedPatientId = defaultPatient._id;
    } else {
      return res.status(400).json({
        success: false,
        message: 'A valid patient reference is required for practice submissions.',
        data: null,
      });
    }
  }

  // 5. Handle video storage (base64 payload to local disk)
  let finalVideoUrl = directVideoUrl || '';
  if (videoBase64) {
    await ensureRecordingsDir();
    // Safely extract raw base64 data regardless of codecs or MIME type headers
    const commaIndex = videoBase64.indexOf(',');
    const cleanBase64 = commaIndex !== -1 ? videoBase64.substring(commaIndex + 1).trim() : videoBase64.trim();

    let ext = 'webm';
    if (videoBase64.startsWith('data:video/mp4')) {
      ext = 'mp4';
    }

    const filename = `rec-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const targetFilePath = path.join(RECORDINGS_DIR, filename);
    const videoBuffer = Buffer.from(cleanBase64, 'base64');

    if (videoBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty video payload received.',
        data: null,
      });
    }

    await fs.writeFile(targetFilePath, videoBuffer);
    finalVideoUrl = `/uploads/recordings/${filename}`;
  }

  if (!finalVideoUrl) {
    return res.status(400).json({
      success: false,
      message: 'Video content or videoUrl must be provided.',
      data: null,
    });
  }

  // 6. Create Submission record
  const submission = await Submission.create({
    patientId: resolvedPatientId,
    parentId: resolvedParentId,
    clinicianId: resolvedClinicianId,
    assessmentId: resolvedAssessmentId,
    reportId: resolvedReportId,
    activityId: activityId || 'act-practice',
    activityTitle: activityTitle || 'Speech Practice Session',
    activityCategory: activityCategory || 'Communication Practice',
    videoUrl: finalVideoUrl,
    duration: typeof duration === 'number' ? duration : 0,
    formattedDuration: formattedDuration || '0:00',
    notes: notes || '',
    status: 'Sent',
    sentAt: new Date(),
  });

  const populated = await Submission.findById(submission._id)
    .populate('patientId', 'fullName age gender diagnosis patientId')
    .populate('parentId', 'fullName email')
    .populate('clinicianId', 'fullName email role');

  res.status(201).json({
    success: true,
    message: 'Practice recording submitted successfully to your clinician.',
    data: populated,
  });
});

// @desc    Get submissions based on user role (Parent sees their child's; Clinician sees assigned patients)
// @route   GET /api/submissions
// @access  Private
export const getSubmissions = asyncHandler(async (req, res) => {
  let filter = {};

  if (req.user.role === 'parent') {
    filter.parentId = req.user._id;
  } else if (req.user.role === 'Clinician' || req.user.role === 'doctor') {
    const clinicianPatients = await Patient.find({ createdBy: req.user._id }).select('_id');
    const patientIds = clinicianPatients.map((p) => p._id);
    filter = {
      $or: [
        { clinicianId: req.user._id },
        { patientId: { $in: patientIds } },
      ],
    };
  }

  const submissions = await Submission.find(filter)
    .populate('patientId', 'fullName age gender diagnosis patientId')
    .populate('parentId', 'fullName email')
    .populate('clinicianId', 'fullName email role')
    .populate('reportId', 'clinicalReport caregiverReport recommendations')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: submissions.length,
    message: 'Submissions retrieved successfully.',
    data: submissions,
  });
});

// @desc    Get single submission by ID
// @route   GET /api/submissions/:id
// @access  Private
export const getSubmissionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await Submission.findById(id)
    .populate('patientId', 'fullName age gender diagnosis patientId')
    .populate('parentId', 'fullName email')
    .populate('clinicianId', 'fullName email role')
    .populate('reportId');

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found.',
      data: null,
    });
  }

  // Authorization check for parent
  if (req.user.role === 'parent') {
    if (submission.parentId?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this submission.',
        data: null,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: submission,
  });
});

// @desc    Review submission and add clinician feedback
// @route   PATCH /api/submissions/:id/review
// @access  Private (Clinician/Admin)
export const reviewSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { clinicianFeedback } = req.body;

  const submission = await Submission.findById(id);
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found.',
      data: null,
    });
  }

  submission.status = 'Reviewed';
  submission.reviewedAt = new Date();
  if (clinicianFeedback !== undefined) {
    submission.clinicianFeedback = clinicianFeedback;
  }

  await submission.save();

  const updated = await Submission.findById(submission._id)
    .populate('patientId', 'fullName age gender diagnosis patientId')
    .populate('parentId', 'fullName email')
    .populate('clinicianId', 'fullName email role');

  res.status(200).json({
    success: true,
    message: 'Recording marked as reviewed successfully.',
    data: updated,
  });
});

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private
export const deleteSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await Submission.findById(id);
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found.',
      data: null,
    });
  }

  const isOwnerParent = submission.parentId?.toString() === req.user._id.toString();
  const isAssignedClinician = submission.clinicianId?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'Admin';

  if (!isOwnerParent && !isAssignedClinician && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this submission.',
      data: null,
    });
  }

  // Delete physical video file from disk if local
  if (submission.videoUrl && submission.videoUrl.startsWith('/uploads/recordings/')) {
    const filename = path.basename(submission.videoUrl);
    const diskPath = path.join(RECORDINGS_DIR, filename);
    try {
      await fs.unlink(diskPath);
    } catch {
      // Ignore if file was already removed
    }
  }

  await submission.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Submission deleted successfully.',
    data: null,
  });
});

// @desc    Stream video recording with HTTP 206 Partial Content Range support
// @route   GET /api/submissions/stream/:filename
// @access  Public/Protected
export const streamRecording = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const sanitizedFilename = path.basename(filename);
  const filePath = path.join(RECORDINGS_DIR, sanitizedFilename);

  try {
    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const ext = path.extname(sanitizedFilename).toLowerCase();
    const contentType = ext === '.mp4' ? 'video/mp4' : 'video/webm';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const fileStream = fsSync.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cross-Origin-Resource-Policy': 'cross-origin',
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      };
      res.writeHead(200, head);
      fsSync.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: 'Recording video file not found on disk.',
      data: null,
    });
  }
});

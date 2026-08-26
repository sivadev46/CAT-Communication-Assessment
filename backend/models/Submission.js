import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Parent reference is required'],
      index: true,
    },
    clinicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Clinician reference is required'],
      index: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      default: null,
      index: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      default: null,
      index: true,
    },
    activityId: {
      type: String,
      default: '',
      trim: true,
    },
    activityTitle: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
    },
    activityCategory: {
      type: String,
      default: '',
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    duration: {
      type: Number,
      default: 0,
    },
    formattedDuration: {
      type: String,
      default: '0:00',
    },
    status: {
      type: String,
      enum: ['Recorded', 'Sent', 'Reviewed'],
      default: 'Sent',
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    clinicianFeedback: {
      type: String,
      default: '',
      trim: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;

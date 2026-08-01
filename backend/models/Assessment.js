import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    eyeContact: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    jointAttention: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    receptiveLanguage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    expressiveLanguage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    socialInteraction: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    overallScore: {
      type: Number,
      required: true,
      default: 0,
    },
    overallPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Pending Review'],
      default: 'In Progress',
    },
    assessmentDate: {
      type: Date,
      default: Date.now,
    },
    responses: {
      type: String,
      default: '',
    },
    clinician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Clinician reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: [true, 'Assessment reference is required'],
      index: true,
    },
    clinicalReport: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    caregiverReport: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    areasForImprovement: {
      type: [String],
      default: [],
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    shared: {
      type: Boolean,
      default: false,
    },
    sharedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;

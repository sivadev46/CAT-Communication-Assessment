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
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;

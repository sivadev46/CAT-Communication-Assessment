import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Patient full name is required'],
      trim: true,
    },
    age: {
      type: String,
      required: [true, 'Age is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-binary', 'Other'],
      default: 'Male',
    },
    diagnosis: {
      type: String,
      required: [true, 'Clinical diagnosis is required'],
      trim: true,
    },
    guardianName: {
      type: String,
      default: '',
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Pending Review'],
      default: 'Scheduled',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate patientId before validating if not present
patientSchema.pre('validate', function () {
  if (!this.patientId) {
    this.patientId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Patient-specific fields
const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: Date,
  address: String,
  medicalHistory: [String],
  allergies: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
})

// Doctor-specific fields
const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  licenseNumber: String,
  yearsExperience: Number,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  availabilitySchedule: {
    type: Map,
    of: [String]
  },
  languages: [String]
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema)
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema)

export default User
export { Patient, Doctor }

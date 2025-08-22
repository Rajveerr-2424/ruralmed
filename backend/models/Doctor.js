const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  specialties: [{
    type: String,
    required: true
  }],
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: {
    type: Number,
    required: true // years of experience
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean }
  },
  consultationFee: {
    video: Number,
    phone: Number,
    chat: Number
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
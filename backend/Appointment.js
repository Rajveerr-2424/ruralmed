const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  type: {
    type: String,
    enum: ['video', 'phone', 'chat'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  reason: {
    type: String,
    required: true
  },
  notes: {
    patient: String,
    doctor: String
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    instructions: String
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  cost: {
    consultationFee: Number,
    currency: { type: String, default: 'USD' }
  },
  videoCallData: {
    roomId: String,
    startTime: Date,
    endTime: Date,
    recordingUrl: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patientId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
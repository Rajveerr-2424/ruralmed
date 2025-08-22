# Create remaining models and middleware
import os

# Create remaining models
remaining_files = {
    "models/Appointment.js": """
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
""",

    "models/Message.js": """
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  file: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  editedAt: Date,
  deletedAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ appointmentId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
""",

    "models/MedicalRecord.js": """
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  type: {
    type: String,
    enum: ['consultation', 'prescription', 'lab_result', 'imaging', 'vaccination', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  diagnosis: [{
    code: String, // ICD-10 code
    description: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  }],
  vitals: {
    temperature: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: Number,
    height: Number,
    bmi: Number
  },
  file: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for efficient queries
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ type: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
""",

    "middleware/auth.js": """
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      profile: user.profile
    };
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
""",

    "sockets/chat.js": """
module.exports = (io) => {
  const chatNamespace = io.of('/chat');
  
  chatNamespace.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);

    // Join appointment room
    socket.on('join_appointment', (appointmentId) => {
      socket.join(`appointment_${appointmentId}`);
      console.log(`User ${socket.id} joined appointment ${appointmentId}`);
    });

    // Handle new message
    socket.on('send_message', (data) => {
      const { appointmentId, message, senderId, senderName } = data;
      
      // Broadcast message to all users in the appointment room
      chatNamespace.to(`appointment_${appointmentId}`).emit('new_message', {
        appointmentId,
        message,
        senderId,
        senderName,
        timestamp: new Date(),
        id: Date.now() // Simple ID generation
      });
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`appointment_${data.appointmentId}`).emit('user_typing', {
        userId: data.userId,
        userName: data.userName
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`appointment_${data.appointmentId}`).emit('user_stopped_typing', {
        userId: data.userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
    });
  });
};
""",

    "sockets/video.js": """
module.exports = (io) => {
  const videoNamespace = io.of('/video');
  
  videoNamespace.on('connection', (socket) => {
    console.log('User connected to video:', socket.id);

    // Join video call room
    socket.on('join_call', (data) => {
      const { appointmentId, userId, role } = data;
      socket.join(`call_${appointmentId}`);
      
      // Notify other participants
      socket.to(`call_${appointmentId}`).emit('user_joined', {
        userId,
        role,
        socketId: socket.id
      });
      
      console.log(`User ${userId} (${role}) joined video call ${appointmentId}`);
    });

    // Handle WebRTC signaling
    socket.on('offer', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('offer', data);
    });

    socket.on('answer', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('answer', data);
    });

    socket.on('ice_candidate', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('ice_candidate', data);
    });

    // Handle call events
    socket.on('start_call', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('call_started', data);
    });

    socket.on('end_call', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('call_ended', data);
    });

    socket.on('toggle_video', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('video_toggled', data);
    });

    socket.on('toggle_audio', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('audio_toggled', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected from video:', socket.id);
    });
  });
};
""",

    "utils/database.js": """
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const initializeDatabase = async () => {
  try {
    // Check if we already have data
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already initialized');
      return;
    }

    console.log('Initializing database with sample data...');

    // Create sample patients
    const patientUser1 = new User({
      email: 'sarah.johnson@email.com',
      password: 'password123',
      role: 'patient'
    });
    await patientUser1.save();

    const patient1 = new Patient({
      userId: patientUser1._id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1979-03-15'),
      gender: 'female',
      phone: '(406) 555-0123',
      address: {
        street: '123 Rural Road',
        city: 'Billings',
        state: 'Montana',
        zipCode: '59101',
        country: 'USA'
      },
      medicalHistory: {
        conditions: ['Diabetes Type 2', 'Hypertension'],
        allergies: ['Penicillin'],
        medications: ['Metformin', 'Lisinopril']
      }
    });
    await patient1.save();

    patientUser1.profile = patient1._id;
    await patientUser1.save();

    // Create sample doctors
    const doctorUser1 = new User({
      email: 'dr.chen@medicenter.com',
      password: 'password123',
      role: 'doctor'
    });
    await doctorUser1.save();

    const doctor1 = new Doctor({
      userId: doctorUser1._id,
      firstName: 'Michael',
      lastName: 'Chen',
      specialties: ['Family Medicine'],
      licenseNumber: 'MT12345',
      experience: 12,
      bio: 'Experienced family physician specializing in rural healthcare and telemedicine.',
      availability: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: false },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: false },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '12:00', available: false },
        sunday: { start: '09:00', end: '12:00', available: false }
      },
      consultationFee: {
        video: 150,
        phone: 100,
        chat: 75
      },
      rating: {
        average: 4.8,
        count: 142
      },
      isVerified: true
    });
    await doctor1.save();

    doctorUser1.profile = doctor1._id;
    await doctorUser1.save();

    console.log('Database initialized with sample data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { initializeDatabase };
"""
}

# Create each file
for filename, content in remaining_files.items():
    # Create directory if it doesn't exist
    directory = os.path.dirname(filename) if '/' in filename else ''
    if directory and not os.path.exists(directory):
        os.makedirs(directory)
    
    # Write file
    with open(filename, 'w') as f:
        f.write(content.strip())

print("Created remaining models (Appointment, Message, MedicalRecord), middleware, socket handlers, and database utilities")
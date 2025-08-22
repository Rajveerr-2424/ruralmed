# Create API routes for the backend
import os

# Create routes directory
if not os.path.exists('routes'):
    os.makedirs('routes')

routes_files = {
    "routes/auth.js": """
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['patient', 'doctor']),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, firstName, lastName, ...profileData } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({ email, password, role });
    await user.save();

    // Create profile based on role
    let profile;
    if (role === 'patient') {
      profile = new Patient({
        userId: user._id,
        firstName,
        lastName,
        ...profileData
      });
    } else if (role === 'doctor') {
      profile = new Doctor({
        userId: user._id,
        firstName,
        lastName,
        ...profileData
      });
    }
    
    await profile.save();
    user.profile = profile._id;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: profile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('profile');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('profile');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
""",

    "routes/appointments.js": """
const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all appointments for a user
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patientId = req.user.profile;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user.profile;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName phone')
      .populate('doctorId', 'firstName lastName specialties')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new appointment
router.post('/', [auth, [
  body('doctorId').notEmpty(),
  body('date').isISO8601(),
  body('time').notEmpty(),
  body('type').isIn(['video', 'phone', 'chat']),
  body('reason').notEmpty()
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = new Appointment({
      patientId: req.user.profile,
      ...req.body,
      status: 'scheduled'
    });

    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'firstName lastName phone')
      .populate('doctorId', 'firstName lastName specialties');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.profile) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user.profile) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(appointment, req.body);
    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'firstName lastName phone')
      .populate('doctorId', 'firstName lastName specialties');

    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.profile) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
""",

    "routes/doctors.js": """
const express = require('express');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialty, available } = req.query;
    let query = { isVerified: true };

    if (specialty) {
      query.specialties = { $in: [specialty] };
    }

    const doctors = await Doctor.find(query)
      .select('-userId')
      .sort({ 'rating.average': -1 });

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-userId');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.user.profile,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor availability
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('availability');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor.availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
""",

    "routes/patients.js": """
const express = require('express');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

const router = express.Router();

// Get patient profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findById(req.user.profile);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.user.profile,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by ID (for doctors)
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findById(req.params.id)
      .select('-userId');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
""",

    "routes/chat.js": """
const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get chat messages between patient and doctor
router.get('/:appointmentId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      appointmentId: req.params.appointmentId
    })
    .populate('senderId', 'firstName lastName role')
    .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { appointmentId, content, type = 'text' } = req.body;

    const message = new Message({
      appointmentId,
      senderId: req.user.userId,
      content,
      type,
      timestamp: new Date()
    });

    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
""",

    "routes/video.js": """
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate video call token (placeholder for WebRTC implementation)
router.post('/token', auth, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    // In a real implementation, you would integrate with a service like
    // Twilio Video, Agora, or implement your own WebRTC signaling server
    
    const token = `video_token_${appointmentId}_${req.user.userId}_${Date.now()}`;
    
    res.json({
      token,
      appointmentId,
      userId: req.user.userId,
      role: req.user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start video call
router.post('/start/:appointmentId', auth, async (req, res) => {
  try {
    // Update appointment status to 'in_progress'
    // Log video call start time
    // Send notifications
    
    res.json({
      message: 'Video call started',
      appointmentId: req.params.appointmentId,
      startTime: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// End video call
router.post('/end/:appointmentId', auth, async (req, res) => {
  try {
    const { duration } = req.body;
    
    // Update appointment status to 'completed'
    // Log video call end time and duration
    // Send follow-up notifications
    
    res.json({
      message: 'Video call ended',
      appointmentId: req.params.appointmentId,
      duration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
""",

    "routes/records.js": """
const express = require('express');
const multer = require('multer');
const path = require('path');
const MedicalRecord = require('../models/MedicalRecord');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get medical records for a patient
router.get('/:patientId', auth, async (req, res) => {
  try {
    // Check authorization
    if (req.user.role === 'patient' && req.params.patientId !== req.user.profile) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const records = await MedicalRecord.find({
      patientId: req.params.patientId
    })
    .populate('createdBy', 'firstName lastName')
    .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new medical record
router.post('/', [auth, upload.single('file')], async (req, res) => {
  try {
    const recordData = {
      patientId: req.body.patientId,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user.userId
    };

    if (req.file) {
      recordData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }

    const record = new MedicalRecord(recordData);
    await record.save();

    const populatedRecord = await MedicalRecord.findById(record._id)
      .populate('createdBy', 'firstName lastName');

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
"""
}

# Create each route file
for filename, content in routes_files.items():
    with open(filename, 'w') as f:
        f.write(content.strip())

print("Created API routes for authentication, appointments, doctors, patients, chat, video, and records")
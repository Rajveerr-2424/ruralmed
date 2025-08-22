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
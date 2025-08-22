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
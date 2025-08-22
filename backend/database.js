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
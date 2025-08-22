# Create setup scripts and documentation
import os

setup_files = {
    "setup.js": """
// Database setup script
const mongoose = require('mongoose');
const { initializeDatabase } = require('./utils/database');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rural-telemedicine', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Initialize with sample data
    await initializeDatabase();
    
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
""",

    "README.md": """
# Rural Telemedicine Connector - Backend API

A comprehensive backend API for the Rural Telemedicine Connector platform, designed to provide healthcare services to rural communities through telemedicine.

## Features

- **User Authentication** - JWT-based authentication for patients and doctors
- **Appointment Management** - Schedule and manage video/phone/chat consultations
- **Real-time Chat** - Socket.io powered messaging between patients and doctors
- **Video Calling** - WebRTC signaling infrastructure for video consultations
- **Medical Records** - Secure storage and management of patient medical records
- **File Uploads** - Support for medical documents and images
- **Role-based Access** - Separate interfaces and permissions for patients and doctors

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. **Clone/Download the backend files**
   ```bash
   mkdir rural-telemedicine-backend
   cd rural-telemedicine-backend
   # Copy all the backend files here
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Ubuntu/Debian
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

5. **Initialize the database**
   ```bash
   node setup.js
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rural-telemedicine
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Patients
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile
- `GET /api/patients/:id` - Get patient by ID (doctors only)

### Doctors
- `GET /api/doctors` - Get all verified doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/:id/availability` - Get doctor availability

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Chat
- `GET /api/chat/:appointmentId` - Get chat messages
- `POST /api/chat` - Send message

### Video
- `POST /api/video/token` - Generate video call token
- `POST /api/video/start/:appointmentId` - Start video call
- `POST /api/video/end/:appointmentId` - End video call

### Medical Records
- `GET /api/records/:patientId` - Get patient medical records
- `POST /api/records` - Create new medical record

## Real-time Features

The application uses Socket.io for real-time features:

### Chat Namespace (`/chat`)
- `join_appointment` - Join appointment chat room
- `send_message` - Send message to appointment room
- `typing_start/typing_stop` - Typing indicators

### Video Namespace (`/video`)
- `join_call` - Join video call room
- `offer/answer/ice_candidate` - WebRTC signaling
- `start_call/end_call` - Call management

## Sample Data

The setup script creates sample users:

**Patient:**
- Email: sarah.johnson@email.com
- Password: password123

**Doctor:**
- Email: dr.chen@medicenter.com
- Password: password123

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet for security headers
- Input validation with express-validator
- File upload restrictions

## Development

```bash
# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Start production server
npm start
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Set strong JWT secret
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Use a process manager like PM2

## HIPAA Compliance Considerations

This backend implements several HIPAA compliance features:
- Encrypted data transmission
- Access controls and authentication
- Audit logging capabilities
- Secure file storage
- Data validation and sanitization

**Note:** For full HIPAA compliance in production, additional measures are required including:
- End-to-end encryption
- Comprehensive audit logs
- Business Associate Agreements
- Regular security assessments
- Physical and technical safeguards

## License

MIT License - see LICENSE file for details
""",

    "package-lock.json": """
{
  "name": "rural-telemedicine-backend",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "name": "rural-telemedicine-backend",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.18.2",
        "mongoose": "^7.5.0",
        "cors": "^2.8.5",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.2",
        "multer": "^1.4.5",
        "socket.io": "^4.7.2",
        "express-rate-limit": "^6.10.0",
        "helmet": "^7.0.0",
        "express-validator": "^7.0.1",
        "dotenv": "^16.3.1",
        "nodemailer": "^6.9.4",
        "twilio": "^4.15.0",
        "node-cron": "^3.0.2",
        "compression": "^1.7.4"
      },
      "devDependencies": {
        "nodemon": "^3.0.1",
        "jest": "^29.6.2"
      }
    }
  }
}
"""
}

# Create setup files
for filename, content in setup_files.items():
    with open(filename, 'w') as f:
        f.write(content.strip())

# Create directories
os.makedirs('uploads', exist_ok=True)
os.makedirs('logs', exist_ok=True)

print("Created setup script, README documentation, and project structure")
print("\nBackend file structure:")
print("├── server.js")
print("├── package.json")
print("├── .env")
print("├── setup.js")
print("├── README.md")
print("├── models/")
print("│   ├── User.js")
print("│   ├── Patient.js")
print("│   ├── Doctor.js")
print("│   ├── Appointment.js")
print("│   ├── Message.js")
print("│   └── MedicalRecord.js")
print("├── routes/")
print("│   ├── auth.js")
print("│   ├── patients.js")
print("│   ├── doctors.js")
print("│   ├── appointments.js")
print("│   ├── chat.js")
print("│   ├── video.js")
print("│   └── records.js")
print("├── middleware/")
print("│   └── auth.js")
print("├── sockets/")
print("│   ├── chat.js")
print("│   └── video.js")
print("├── utils/")
print("│   └── database.js")
print("├── uploads/")
print("└── logs/")
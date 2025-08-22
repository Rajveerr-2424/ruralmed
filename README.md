# Rural Healthcare System - Full Stack Application

A comprehensive telemedicine platform designed for rural healthcare delivery with multilingual support, AI-powered features, and mobile-first design.

## 🚀 Features

### 🔐 Authentication & User Management
- Multi-role authentication (Patient, Doctor, Admin)
- JWT-based secure authentication
- Role-based access control
- Demo accounts for testing

### 👥 Patient Features
- Personal health dashboard
- AI-powered symptom checker
- Health chatbot assistance
- Appointment booking system
- Video consultations
- Medical records management
- Prescription tracking

### ⚕️ Doctor Features
- Professional dashboard
- Patient management
- Appointment scheduling
- Medical records access
- Prescription writing
- Video consultations
- AI-assisted diagnosis

### 🛠️ Admin Features
- System analytics
- User management
- Doctor verification
- System configuration
- Reports and insights

### 🌍 Rural Optimization
- Multilingual support (10+ languages)
- Offline-first architecture
- Low bandwidth optimization
- Mobile-responsive design
- Progressive Web App (PWA)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB** - NoSQL database
- **Mongoose** - Object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### AI & External Services
- **OpenAI API** - AI-powered features
- **Twilio** - Video calling
- **Socket.io** - Real-time communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- Twilio account (for video features)
- OpenAI API key (for AI features)

### Installation

1. **Clone and Setup**
   ```bash
   # Extract the ZIP file
   cd rural-healthcare-system
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rural-healthcare
   JWT_SECRET=your-super-secret-jwt-key
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   OPENAI_API_KEY=your-openai-api-key
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rural-healthcare
JWT_SECRET=your-production-jwt-secret
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
OPENAI_API_KEY=your-openai-api-key
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Other Platforms

#### Netlify
- Build command: `npm run build`
- Publish directory: `.next`
- Install Next.js adapter for Netlify

#### Railway/Render
- Supports Next.js out of the box
- Set environment variables in platform dashboard
- Auto-deploy from GitHub

## 🧪 Testing

### Demo Accounts
- **Patient**: `patient@demo.com` / `password123`
- **Doctor**: `doctor@demo.com` / `password123`
- **Admin**: `admin@demo.com` / `password123`

### Test Features
1. Login with different roles
2. Navigate through dashboards
3. Test appointment booking (patient)
4. Test patient management (doctor)
5. Test system analytics (admin)

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Offline capabilities
- Progressive Web App (PWA)
- Fast loading on slow networks

## 🌍 Multilingual Support

Supported languages:
- English
- Hindi (हिंदी)
- Bengali (বাংলা)
- Telugu (తెలుగు)
- Marathi (मराठी)
- Tamil (தமிழ்)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Odia (ଓଡ଼ିଆ)
- Punjabi (ਪੰਜਾਬੀ)

## 🔒 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- HIPAA-compliant design patterns

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:id` - Update appointment

### AI Features
- `POST /api/ai/symptoms` - Symptom analysis
- `POST /api/ai/chat` - Health chatbot

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ for rural healthcare communities**

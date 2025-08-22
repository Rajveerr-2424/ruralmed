# Create a modified frontend app.js that connects to the backend API
frontend_api_js = """
// Rural Telemedicine Connector - API Connected Frontend Application

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Global state
let currentUser = null;
let authToken = null;
let socket = null;
let videoSocket = null;
let currentAppointmentId = null;

// Utility Functions
const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const getAuthHeaders = () => {
  return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
};

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    showNotification(error.message || 'Something went wrong', 'error');
    throw error;
  }
};

// Socket.io initialization
const initializeSockets = () => {
  if (authToken) {
    // Chat socket
    socket = io(`${SOCKET_URL}/chat`, {
      auth: { token: authToken }
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('new_message', (message) => {
      displayNewMessage(message);
      showNotification('New message received');
    });

    // Video socket
    videoSocket = io(`${SOCKET_URL}/video`, {
      auth: { token: authToken }
    });

    videoSocket.on('connect', () => {
      console.log('Connected to video server');
    });
  }
};

// Authentication Functions
const login = async (email, password) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setAuthToken(response.token);
    currentUser = response.user;
    initializeSockets();
    return response.user;
  } catch (error) {
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    setAuthToken(response.token);
    currentUser = response.user;
    initializeSockets();
    return response.user;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  setAuthToken(null);
  currentUser = null;
  if (socket) socket.disconnect();
  if (videoSocket) videoSocket.disconnect();
  showPage('landing-page');
};

// Check for existing auth on page load
const checkExistingAuth = async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
    try {
      const user = await apiCall('/auth/me');
      currentUser = user;
      initializeSockets();
      showDashboard(user.role);
    } catch (error) {
      logout();
    }
  }
};

// API Functions
const getDoctors = async (specialty = null) => {
  try {
    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
    return await apiCall(`/doctors${query}`);
  } catch (error) {
    return [];
  }
};

const getAppointments = async () => {
  try {
    return await apiCall('/appointments');
  } catch (error) {
    return [];
  }
};

const createAppointment = async (appointmentData) => {
  try {
    return await apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  } catch (error) {
    throw error;
  }
};

const updateAppointment = async (appointmentId, updates) => {
  try {
    return await apiCall(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    throw error;
  }
};

const getChatMessages = async (appointmentId) => {
  try {
    return await apiCall(`/chat/${appointmentId}`);
  } catch (error) {
    return [];
  }
};

const sendMessage = async (appointmentId, content) => {
  try {
    const message = await apiCall('/chat', {
      method: 'POST',
      body: JSON.stringify({ appointmentId, content })
    });

    // Also emit through socket for real-time updates
    if (socket) {
      socket.emit('send_message', {
        appointmentId,
        message: content,
        senderId: currentUser.id,
        senderName: `${currentUser.profile.firstName} ${currentUser.profile.lastName}`
      });
    }

    return message;
  } catch (error) {
    throw error;
  }
};

const getPatientProfile = async () => {
  try {
    return await apiCall('/patients/profile');
  } catch (error) {
    return null;
  }
};

const updatePatientProfile = async (updates) => {
  try {
    return await apiCall('/patients/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    throw error;
  }
};

const getMedicalRecords = async (patientId) => {
  try {
    return await apiCall(`/records/${patientId}`);
  } catch (error) {
    return [];
  }
};

const generateVideoToken = async (appointmentId) => {
  try {
    return await apiCall('/video/token', {
      method: 'POST',
      body: JSON.stringify({ appointmentId })
    });
  } catch (error) {
    throw error;
  }
};

// UI Functions (keeping existing UI logic but connecting to API)
let currentPage = 'landing-page';
let userRole = null;

const showPage = (pageId) => {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    currentPage = pageId;
    updateBreadcrumb();
  }
};

const showDashboard = (role) => {
  userRole = role;
  if (role === 'patient') {
    showPage('patient-dashboard');
  } else if (role === 'doctor') {
    showPage('doctor-dashboard');
  }
  document.getElementById('main-nav').classList.remove('hidden');
  loadDashboardData();
};

const loadDashboardData = async () => {
  try {
    if (userRole === 'patient') {
      await loadPatientDashboard();
    } else if (userRole === 'doctor') {
      await loadDoctorDashboard();
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

const loadPatientDashboard = async () => {
  // Load appointments
  const appointments = await getAppointments();
  displayPatientAppointments(appointments);

  // Load profile data
  const profile = await getPatientProfile();
  if (profile) {
    displayPatientProfile(profile);
  }
};

const loadDoctorDashboard = async () => {
  // Load appointments
  const appointments = await getAppointments();
  displayDoctorAppointments(appointments);
};

const displayPatientAppointments = (appointments) => {
  const container = document.getElementById('patient-appointments');
  if (!container) return;

  if (appointments.length === 0) {
    container.innerHTML = '<p>No upcoming appointments</p>';
    return;
  }

  container.innerHTML = appointments.map(appointment => `
    <div class="appointment-card">
      <h4>${appointment.doctorId.firstName} ${appointment.doctorId.lastName}</h4>
      <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p><strong>Type:</strong> ${appointment.type}</p>
      <p><strong>Reason:</strong> ${appointment.reason}</p>
      <p><strong>Status:</strong> ${appointment.status}</p>
      <div class="appointment-actions">
        ${appointment.status === 'scheduled' ? `
          <button onclick="startConsultation('${appointment._id}')" class="btn btn--primary">
            Join ${appointment.type === 'video' ? 'Video Call' : appointment.type === 'phone' ? 'Phone Call' : 'Chat'}
          </button>
        ` : ''}
        <button onclick="cancelAppointment('${appointment._id}')" class="btn btn--outline">
          Cancel
        </button>
      </div>
    </div>
  `).join('');
};

const displayDoctorAppointments = (appointments) => {
  const container = document.getElementById('doctor-appointments');
  if (!container) return;

  if (appointments.length === 0) {
    container.innerHTML = '<p>No upcoming appointments</p>';
    return;
  }

  container.innerHTML = appointments.map(appointment => `
    <div class="appointment-card">
      <h4>${appointment.patientId.firstName} ${appointment.patientId.lastName}</h4>
      <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p><strong>Type:</strong> ${appointment.type}</p>
      <p><strong>Reason:</strong> ${appointment.reason}</p>
      <p><strong>Status:</strong> ${appointment.status}</p>
      <div class="appointment-actions">
        ${appointment.status === 'scheduled' ? `
          <button onclick="startConsultation('${appointment._id}')" class="btn btn--primary">
            Start Consultation
          </button>
        ` : ''}
        <button onclick="viewPatientRecord('${appointment.patientId._id}')" class="btn btn--outline">
          View Patient Record
        </button>
      </div>
    </div>
  `).join('');
};

const startConsultation = async (appointmentId) => {
  currentAppointmentId = appointmentId;
  
  try {
    const appointment = await apiCall(`/appointments/${appointmentId}`);
    
    if (appointment.type === 'video') {
      await startVideoCall(appointmentId);
    } else if (appointment.type === 'chat') {
      showChatInterface(appointmentId);
    } else if (appointment.type === 'phone') {
      showPhoneCallInterface(appointmentId);
    }
  } catch (error) {
    console.error('Error starting consultation:', error);
  }
};

const startVideoCall = async (appointmentId) => {
  try {
    const tokenData = await generateVideoToken(appointmentId);
    showPage('video-call');
    initializeVideoCall(appointmentId, tokenData);
  } catch (error) {
    console.error('Error starting video call:', error);
  }
};

const showChatInterface = async (appointmentId) => {
  showPage('chat-interface');
  await loadChatMessages(appointmentId);
  
  if (socket) {
    socket.emit('join_appointment', appointmentId);
  }
};

const loadChatMessages = async (appointmentId) => {
  try {
    const messages = await getChatMessages(appointmentId);
    displayChatMessages(messages);
  } catch (error) {
    console.error('Error loading chat messages:', error);
  }
};

const displayChatMessages = (messages) => {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  container.innerHTML = messages.map(message => `
    <div class="message ${message.senderId._id === currentUser.id ? 'sent' : 'received'}">
      <div class="message-header">
        <strong>${message.senderId.firstName} ${message.senderId.lastName}</strong>
        <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
      <div class="message-content">${message.content}</div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
};

const displayNewMessage = (message) => {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const messageElement = document.createElement('div');
  messageElement.className = `message ${message.senderId === currentUser.id ? 'sent' : 'received'}`;
  messageElement.innerHTML = `
    <div class="message-header">
      <strong>${message.senderName}</strong>
      <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
    </div>
    <div class="message-content">${message.message}</div>
  `;

  container.appendChild(messageElement);
  container.scrollTop = container.scrollHeight;
};

const sendChatMessage = async () => {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  
  if (message && currentAppointmentId) {
    try {
      await sendMessage(currentAppointmentId, message);
      input.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

// Appointment booking
const showAppointmentBooking = async () => {
  showPage('appointment-booking');
  const doctors = await getDoctors();
  displayDoctorsForBooking(doctors);
};

const displayDoctorsForBooking = (doctors) => {
  const container = document.getElementById('doctors-list');
  if (!container) return;

  container.innerHTML = doctors.map(doctor => `
    <div class="doctor-card" onclick="selectDoctor('${doctor._id}')">
      <h4>Dr. ${doctor.firstName} ${doctor.lastName}</h4>
      <p><strong>Specialty:</strong> ${doctor.specialties.join(', ')}</p>
      <p><strong>Experience:</strong> ${doctor.experience} years</p>
      <p><strong>Rating:</strong> ${doctor.rating.average}/5 (${doctor.rating.count} reviews)</p>
      <div class="consultation-fees">
        <p><strong>Video:</strong> $${doctor.consultationFee.video}</p>
        <p><strong>Phone:</strong> $${doctor.consultationFee.phone}</p>
        <p><strong>Chat:</strong> $${doctor.consultationFee.chat}</p>
      </div>
    </div>
  `).join('');
};

let selectedDoctorId = null;

const selectDoctor = (doctorId) => {
  selectedDoctorId = doctorId;
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.classList.remove('selected');
  });
  event.target.closest('.doctor-card').classList.add('selected');
  
  document.getElementById('booking-form').style.display = 'block';
};

const bookAppointment = async () => {
  if (!selectedDoctorId) {
    showNotification('Please select a doctor', 'error');
    return;
  }

  const form = document.getElementById('appointment-form');
  const formData = new FormData(form);
  
  const appointmentData = {
    doctorId: selectedDoctorId,
    date: formData.get('date'),
    time: formData.get('time'),
    type: formData.get('type'),
    reason: formData.get('reason')
  };

  try {
    await createAppointment(appointmentData);
    showNotification('Appointment booked successfully!', 'success');
    showPage('patient-dashboard');
    loadPatientDashboard();
  } catch (error) {
    console.error('Error booking appointment:', error);
  }
};

// Utility functions
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
};

const updateBreadcrumb = () => {
  const breadcrumb = document.getElementById('breadcrumb-text');
  if (!breadcrumb) return;

  const pageNames = {
    'landing-page': 'Home',
    'patient-dashboard': 'Patient Dashboard',
    'doctor-dashboard': 'Doctor Dashboard',
    'appointment-booking': 'Book Appointment',
    'video-call': 'Video Call',
    'chat-interface': 'Chat',
    'medical-records': 'Medical Records',
    'symptom-checker': 'Symptom Checker'
  };

  breadcrumb.textContent = pageNames[currentPage] || 'Home';
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 1500);

  // Check for existing authentication
  await checkExistingAuth();

  // Set up event listeners
  setupEventListeners();
});

const setupEventListeners = () => {
  // Landing page buttons
  document.getElementById('patient-btn')?.addEventListener('click', () => {
    if (currentUser) {
      showDashboard('patient');
    } else {
      showLoginForm('patient');
    }
  });

  document.getElementById('doctor-btn')?.addEventListener('click', () => {
    if (currentUser) {
      showDashboard('doctor');
    } else {
      showLoginForm('doctor');
    }
  });

  // Navigation buttons
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  document.getElementById('emergency-btn')?.addEventListener('click', showEmergencyContacts);

  // Chat input
  document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
};

const showLoginForm = (role) => {
  // Implementation for login form display
  showPage('login-page');
};

const showEmergencyContacts = () => {
  document.getElementById('emergency-banner').classList.remove('hidden');
};

// Sample symptom checker (static for demo)
const symptomChecker = {
  currentStep: 0,
  symptoms: [],
  
  questions: [
    {
      text: "Are you experiencing fever?",
      options: ["Yes", "No"]
    },
    {
      text: "Do you have difficulty breathing?",
      options: ["Yes", "No"]
    },
    {
      text: "Are you experiencing chest pain?",
      options: ["Yes", "No"]
    }
  ],
  
  start() {
    this.currentStep = 0;
    this.symptoms = [];
    showPage('symptom-checker');
    this.displayQuestion();
  },
  
  displayQuestion() {
    const container = document.getElementById('symptom-question');
    const question = this.questions[this.currentStep];
    
    if (!question) {
      this.showResults();
      return;
    }
    
    container.innerHTML = `
      <h3>${question.text}</h3>
      <div class="symptom-options">
        ${question.options.map(option => `
          <button onclick="symptomChecker.answer('${option}')" class="btn btn--outline">
            ${option}
          </button>
        `).join('')}
      </div>
    `;
  },
  
  answer(response) {
    this.symptoms.push({
      question: this.questions[this.currentStep].text,
      answer: response
    });
    
    this.currentStep++;
    this.displayQuestion();
  },
  
  showResults() {
    const container = document.getElementById('symptom-question');
    const hasEmergencySymptoms = this.symptoms.some(s => 
      (s.question.includes('breathing') || s.question.includes('chest pain')) && s.answer === 'Yes'
    );
    
    if (hasEmergencySymptoms) {
      container.innerHTML = `
        <div class="symptom-results emergency">
          <h3>⚠️ Seek Immediate Medical Attention</h3>
          <p>Based on your symptoms, you should seek emergency medical care immediately.</p>
          <button onclick="call('911')" class="btn btn--emergency">Call 911</button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="symptom-results">
          <h3>Recommendation</h3>
          <p>Consider scheduling a consultation with a healthcare provider to discuss your symptoms.</p>
          <button onclick="showAppointmentBooking()" class="btn btn--primary">Schedule Appointment</button>
        </div>
      `;
    }
  }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    apiCall,
    login,
    register,
    getDoctors,
    getAppointments,
    createAppointment
  };
}
"""

# Write the API-connected frontend file
with open('app-with-api.js', 'w') as f:
    f.write(frontend_api_js.strip())

print("Created API-connected frontend JavaScript file: app-with-api.js")
print("\nThis file replaces the original app.js and connects to the backend API")
print("Key differences:")
print("- Real authentication with JWT tokens")
print("- API calls to backend endpoints")
print("- Real-time chat and video calling via Socket.io")
print("- Persistent user sessions")
print("- Database-backed data instead of static data")
// Rural Telemedicine Connector - JavaScript Application

// Application Data
const appData = {
  patients: [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 45,
      location: "Rural Montana",
      phone: "(406) 555-0123",
      email: "sarah.j@email.com",
      conditions: ["Diabetes Type 2", "Hypertension"],
      lastVisit: "2024-08-15"
    },
    {
      id: 2,
      name: "Miguel Rodriguez",
      age: 62,
      location: "Rural Texas",
      phone: "(432) 555-0456",
      email: "miguel.r@email.com",
      conditions: ["COPD", "Arthritis"],
      lastVisit: "2024-08-18"
    },
    {
      id: 3,
      name: "Emma Thompson",
      age: 28,
      location: "Rural Ohio",
      phone: "(740) 555-0789",
      email: "emma.t@email.com",
      conditions: ["Asthma"],
      lastVisit: "2024-08-20"
    }
  ],
  doctors: [
    {
      id: 1,
      name: "Dr. Michael Chen",
      specialty: "Family Medicine",
      experience: "12 years",
      rating: 4.8,
      location: "Urban Medical Center",
      availability: ["Monday", "Wednesday", "Friday"]
    },
    {
      id: 2,
      name: "Dr. Linda Rodriguez",
      specialty: "Cardiology",
      experience: "18 years",
      rating: 4.9,
      location: "Regional Heart Center",
      availability: ["Tuesday", "Thursday", "Saturday"]
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      specialty: "Mental Health",
      experience: "10 years",
      rating: 4.7,
      location: "Telehealth Specialist",
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  ],
  appointments: [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      date: "2024-08-25",
      time: "10:00 AM",
      type: "Video Consultation",
      status: "Scheduled",
      reason: "Diabetes Follow-up"
    },
    {
      id: 2,
      patientId: 2,
      doctorId: 2,
      date: "2024-08-26",
      time: "2:00 PM",
      type: "Video Consultation",
      status: "Scheduled",
      reason: "Heart Health Check"
    }
  ],
  symptoms: [
    {
      category: "General",
      items: ["Fever", "Fatigue", "Headache", "Nausea", "Dizziness"]
    },
    {
      category: "Respiratory",
      items: ["Cough", "Shortness of breath", "Chest pain", "Sore throat"]
    },
    {
      category: "Cardiovascular",
      items: ["Chest pain", "Palpitations", "Swelling in legs", "Irregular heartbeat"]
    },
    {
      category: "Digestive",
      items: ["Stomach pain", "Nausea", "Vomiting", "Diarrhea", "Loss of appetite"]
    }
  ],
  chatMessages: [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      sender: "patient",
      message: "Good morning Dr. Chen, I've been monitoring my blood sugar as requested.",
      timestamp: "2024-08-22 09:15:00",
      read: true
    },
    {
      id: 2,
      patientId: 1,
      doctorId: 1,
      sender: "doctor",
      message: "Good morning Sarah! That's excellent. What have the readings been like?",
      timestamp: "2024-08-22 09:18:00",
      read: true
    }
  ],
  healthTips: [
    {
      title: "Managing Diabetes in Rural Areas",
      content: "Regular monitoring and healthy eating are key to managing diabetes effectively, even with limited access to specialists."
    },
    {
      title: "Heart Health Tips",
      content: "Stay active with simple exercises like walking, and monitor your blood pressure regularly if you have heart conditions."
    },
    {
      title: "Mental Health Support",
      content: "Don't hesitate to reach out for mental health support. Telehealth makes it easier to access counseling from home."
    }
  ],
  emergencyContacts: [
    {
      service: "Emergency Services",
      number: "911",
      description: "For life-threatening emergencies"
    },
    {
      service: "Poison Control",
      number: "1-800-222-1222",
      description: "For poison-related emergencies"
    },
    {
      service: "Crisis Helpline",
      number: "988",
      description: "For mental health crises"
    }
  ]
};

// Application State
let currentUser = null;
let currentUserType = null;
let currentPatient = null;
let currentDoctor = null;
let appointmentData = {};
let symptomData = {};
let callTimer = null;
let callStartTime = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

function initializeApp() {
  console.log('Initializing app...');
  // Show loading screen
  setTimeout(() => {
    hideLoading();
    setupEventListeners();
    showLandingPage();
  }, 2000);
}

function hideLoading() {
  console.log('Hiding loading screen...');
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.style.display = 'none';
    }, 500);
  }
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Landing page buttons
  const patientBtn = document.getElementById('patient-btn');
  const doctorBtn = document.getElementById('doctor-btn');
  
  if (patientBtn) {
    console.log('Patient button found, adding listener...');
    patientBtn.addEventListener('click', function() {
      console.log('Patient button clicked');
      selectUserType('patient');
    });
  } else {
    console.error('Patient button not found!');
  }
  
  if (doctorBtn) {
    console.log('Doctor button found, adding listener...');
    doctorBtn.addEventListener('click', function() {
      console.log('Doctor button clicked');
      selectUserType('doctor');
    });
  } else {
    console.error('Doctor button not found!');
  }

  // Navigation
  const logoutBtn = document.getElementById('logout-btn');
  const emergencyBtn = document.getElementById('emergency-btn');
  const closeEmergencyBtn = document.getElementById('close-emergency');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  if (emergencyBtn) {
    emergencyBtn.addEventListener('click', showEmergencyBanner);
  }
  
  if (closeEmergencyBtn) {
    closeEmergencyBtn.addEventListener('click', hideEmergencyBanner);
  }

  // Dashboard cards - use event delegation
  document.addEventListener('click', function(event) {
    if (event.target.closest('.dashboard-card')) {
      handleDashboardAction(event);
    }
  });

  // Back buttons - use event delegation
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('back-btn')) {
      handleBackButton(event);
    }
  });

  // Setup other listeners
  setupAppointmentListeners();
  setupSymptomCheckerListeners();
  setupVideoCallListeners();
  setupChatListeners();
  setupMedicalRecordsTabs();
  setupModalListeners();
  setupCalendarListeners();
  
  console.log('Event listeners setup complete');
}

function selectUserType(type) {
  console.log('Selecting user type:', type);
  currentUserType = type;
  
  if (type === 'patient') {
    currentPatient = appData.patients[0]; // Default to first patient
    currentUser = currentPatient;
    
    const patientNameEl = document.getElementById('patient-name');
    if (patientNameEl) {
      patientNameEl.textContent = currentPatient.name;
    }
    
    console.log('Showing patient dashboard for:', currentPatient.name);
    showPage('patient-dashboard');
    setupPatientDashboard();
  } else {
    currentDoctor = appData.doctors[0]; // Default to first doctor
    currentUser = currentDoctor;
    
    const doctorNameEl = document.getElementById('doctor-name');
    if (doctorNameEl) {
      doctorNameEl.textContent = currentDoctor.name;
    }
    
    console.log('Showing doctor dashboard for:', currentDoctor.name);
    showPage('doctor-dashboard');
    setupDoctorDashboard();
  }
  
  showNavigation();
}

function showPage(pageId) {
  console.log('Showing page:', pageId);
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });

  // Show selected page
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.remove('hidden');
    page.classList.add('active');
    console.log('Page', pageId, 'is now active');
  } else {
    console.error('Page not found:', pageId);
  }

  // Update breadcrumb
  updateBreadcrumb(pageId);
}

function showNavigation() {
  console.log('Showing navigation');
  const mainNav = document.getElementById('main-nav');
  const breadcrumb = document.getElementById('breadcrumb');
  
  if (mainNav) {
    mainNav.classList.remove('hidden');
  }
  
  if (breadcrumb) {
    breadcrumb.classList.remove('hidden');
  }
}

function updateBreadcrumb(pageId) {
  const breadcrumbText = document.getElementById('breadcrumb-text');
  if (!breadcrumbText) return;
  
  const breadcrumbMap = {
    'landing-page': 'Home',
    'patient-dashboard': 'Patient Dashboard',
    'doctor-dashboard': 'Doctor Dashboard',
    'appointment-scheduling': 'Schedule Appointment',
    'symptom-checker': 'Symptom Checker',
    'video-call': 'Video Call',
    'chat-interface': 'Chat',
    'appointments-list': 'My Appointments',
    'medical-records': 'Medical Records'
  };
  
  breadcrumbText.textContent = breadcrumbMap[pageId] || 'Dashboard';
}

function logout() {
  showConfirmationModal(
    'Logout Confirmation',
    'Are you sure you want to logout?',
    () => {
      currentUser = null;
      currentUserType = null;
      currentPatient = null;
      currentDoctor = null;
      
      const mainNav = document.getElementById('main-nav');
      const breadcrumb = document.getElementById('breadcrumb');
      
      if (mainNav) {
        mainNav.classList.add('hidden');
      }
      
      if (breadcrumb) {
        breadcrumb.classList.add('hidden');
      }
      
      showLandingPage();
    }
  );
}

function showLandingPage() {
  console.log('Showing landing page');
  showPage('landing-page');
}

function showEmergencyBanner() {
  const banner = document.getElementById('emergency-banner');
  if (banner) {
    banner.classList.remove('hidden');
  }
}

function hideEmergencyBanner() {
  const banner = document.getElementById('emergency-banner');
  if (banner) {
    banner.classList.add('hidden');
  }
}

function handleDashboardAction(event) {
  const dashboardCard = event.target.closest('.dashboard-card');
  if (!dashboardCard) return;
  
  const action = dashboardCard.dataset.action;
  console.log('Dashboard action:', action);
  
  switch (action) {
    case 'schedule-appointment':
      showPage('appointment-scheduling');
      setupAppointmentScheduling();
      break;
    case 'start-video':
      startVideoCall();
      break;
    case 'chat':
      showPage('chat-interface');
      setupChatInterface();
      break;
    case 'symptom-checker':
      showPage('symptom-checker');
      setupSymptomChecker();
      break;
    case 'appointments':
      showPage('appointments-list');
      setupAppointmentsList();
      break;
    case 'records':
      showPage('medical-records');
      setupMedicalRecords();
      break;
    // Doctor actions
    case 'patient-appointments':
      showPage('appointments-list');
      setupDoctorAppointments();
      break;
    case 'start-consultation':
      startVideoCall();
      break;
    case 'patient-records-doc':
      showPage('medical-records');
      setupDoctorPatientRecords();
      break;
    case 'messages':
      showPage('chat-interface');
      setupDoctorChat();
      break;
    case 'schedule-management':
      showScheduleManagement();
      break;
    case 'patient-search':
      showPatientSearch();
      break;
    default:
      console.log('Unknown action:', action);
  }
}

function handleBackButton(event) {
  const backTo = event.currentTarget.dataset.back;
  console.log('Going back to:', backTo);
  showPage(backTo);
}

// Patient Dashboard Setup
function setupPatientDashboard() {
  console.log('Setting up patient dashboard');
  // Display health tips
  const tipsContainer = document.getElementById('health-tips-list');
  if (tipsContainer) {
    tipsContainer.innerHTML = '';
    
    appData.healthTips.forEach(tip => {
      const tipElement = document.createElement('div');
      tipElement.className = 'tip-item';
      tipElement.innerHTML = `
        <h4>${tip.title}</h4>
        <p>${tip.content}</p>
      `;
      tipsContainer.appendChild(tipElement);
    });
  }
}

// Doctor Dashboard Setup
function setupDoctorDashboard() {
  console.log('Doctor dashboard setup for:', currentDoctor.name);
}

// Appointment Scheduling
function setupAppointmentListeners() {
  // Use event delegation for confirm button
  document.addEventListener('click', function(event) {
    if (event.target.id === 'confirm-appointment') {
      confirmAppointment();
    }
  });
}

function setupAppointmentScheduling() {
  console.log('Setting up appointment scheduling');
  appointmentData = {};
  showStep(1);
  populateDoctorList();
}

function populateDoctorList() {
  const doctorList = document.getElementById('doctor-list');
  if (!doctorList) return;
  
  doctorList.innerHTML = '';

  appData.doctors.forEach(doctor => {
    const doctorCard = document.createElement('div');
    doctorCard.className = 'doctor-card';
    doctorCard.dataset.doctorId = doctor.id;
    doctorCard.innerHTML = `
      <h4>${doctor.name}</h4>
      <div class="doctor-specialty">${doctor.specialty}</div>
      <div class="doctor-experience">${doctor.experience} experience</div>
      <div class="doctor-rating">★ ${doctor.rating}</div>
    `;
    
    doctorCard.addEventListener('click', () => selectDoctor(doctor, doctorCard));
    doctorList.appendChild(doctorCard);
  });
}

function selectDoctor(doctor, cardElement) {
  console.log('Selected doctor:', doctor.name);
  appointmentData.doctor = doctor;
  
  // Update UI
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.classList.remove('selected');
  });
  cardElement.classList.add('selected');
  
  // Show next step after delay
  setTimeout(() => {
    showStep(2);
    setupCalendar();
  }, 1000);
}

function showStep(stepNumber) {
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.add('hidden');
  });
  
  const stepEl = document.getElementById(`step-${stepNumber}`);
  if (stepEl) {
    stepEl.classList.remove('hidden');
  }
}

function setupCalendar() {
  const calendar = document.getElementById('calendar');
  if (calendar) {
    calendar.innerHTML = generateCalendar();
    setupTimeSlots();
  }
}

function generateCalendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  
  let calendarHTML = `
    <div class="calendar-header">
      <button class="calendar-nav" id="prev-month">‹</button>
      <h4>${monthNames[currentMonth]} ${currentYear}</h4>
      <button class="calendar-nav" id="next-month">›</button>
    </div>
    <div class="calendar-grid">
      <div class="calendar-day-header">Sun</div>
      <div class="calendar-day-header">Mon</div>
      <div class="calendar-day-header">Tue</div>
      <div class="calendar-day-header">Wed</div>
      <div class="calendar-day-header">Thu</div>
      <div class="calendar-day-header">Fri</div>
      <div class="calendar-day-header">Sat</div>
  `;
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<div class="calendar-day disabled"></div>';
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today;
    
    let classes = 'calendar-day';
    if (isToday) classes += ' today';
    if (isPast) classes += ' disabled';
    
    calendarHTML += `
      <button class="${classes}" data-date="${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}" ${isPast ? 'disabled' : ''}>
        ${day}
      </button>
    `;
  }
  
  calendarHTML += '</div>';
  return calendarHTML;
}

function setupCalendarListeners() {
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('calendar-day') && !event.target.disabled) {
      selectDate(event.target);
    }
  });
}

function selectDate(dateElement) {
  document.querySelectorAll('.calendar-day').forEach(day => {
    day.classList.remove('selected');
  });
  dateElement.classList.add('selected');
  
  appointmentData.date = dateElement.dataset.date;
  console.log('Selected date:', appointmentData.date);
  setupTimeSlots();
}

function setupTimeSlots() {
  const timeSlotsContainer = document.getElementById('time-slots');
  if (!timeSlotsContainer) return;
  
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  
  timeSlotsContainer.innerHTML = '';
  
  timeSlots.forEach(time => {
    const isAvailable = Math.random() > 0.3; // Simulate availability
    const slot = document.createElement('button');
    slot.className = `time-slot ${isAvailable ? '' : 'unavailable'}`;
    slot.textContent = time;
    slot.disabled = !isAvailable;
    
    if (isAvailable) {
      slot.addEventListener('click', () => selectTimeSlot(slot, time));
    }
    
    timeSlotsContainer.appendChild(slot);
  });
}

function selectTimeSlot(slotElement, time) {
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.classList.remove('selected');
  });
  slotElement.classList.add('selected');
  
  appointmentData.time = time;
  console.log('Selected time:', appointmentData.time);
  
  setTimeout(() => {
    showStep(3);
  }, 500);
}

function confirmAppointment() {
  const reasonEl = document.getElementById('appointment-reason');
  const typeEl = document.getElementById('appointment-type');
  
  if (!reasonEl || !typeEl) return;
  
  const reason = reasonEl.value;
  const type = typeEl.value;
  
  if (!reason.trim()) {
    alert('Please provide a reason for your appointment.');
    return;
  }
  
  appointmentData.reason = reason;
  appointmentData.type = type;
  
  // Create new appointment
  const newAppointment = {
    id: appData.appointments.length + 1,
    patientId: currentPatient.id,
    doctorId: appointmentData.doctor.id,
    date: appointmentData.date,
    time: appointmentData.time,
    type: appointmentData.type === 'video' ? 'Video Consultation' : appointmentData.type,
    status: 'Scheduled',
    reason: appointmentData.reason
  };
  
  appData.appointments.push(newAppointment);
  
  showConfirmationModal(
    'Appointment Scheduled!',
    `Your appointment with ${appointmentData.doctor.name} has been scheduled for ${appointmentData.date} at ${appointmentData.time}.`,
    () => {
      showPage('patient-dashboard');
    }
  );
}

// Symptom Checker
function setupSymptomCheckerListeners() {
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('body-part')) {
      selectBodyPart(event.target);
    }
    if (event.target.classList.contains('symptom-item')) {
      toggleSymptom(event.target);
    }
    if (event.target.classList.contains('severity-btn')) {
      selectSeverity(event.target);
    }
    if (event.target.id === 'symptom-next') {
      proceedToSeverity();
    }
    if (event.target.id === 'schedule-from-symptoms') {
      showPage('appointment-scheduling');
      setupAppointmentScheduling();
    }
  });
}

function setupSymptomChecker() {
  console.log('Setting up symptom checker');
  symptomData = {};
  showSymptomStep(1);
}

function selectBodyPart(element) {
  document.querySelectorAll('.body-part').forEach(part => {
    part.classList.remove('selected');
  });
  element.classList.add('selected');
  
  const bodyPart = element.dataset.part;
  symptomData.bodyPart = bodyPart;
  console.log('Selected body part:', bodyPart);
  
  setTimeout(() => {
    showSymptomStep(2);
    populateSymptoms(bodyPart);
  }, 500);
}

function populateSymptoms(bodyPart) {
  const symptomList = document.getElementById('symptom-list');
  if (!symptomList) return;
  
  let symptoms = [];
  
  // Map body parts to symptom categories
  switch (bodyPart) {
    case 'head':
      symptoms = ['Headache', 'Dizziness', 'Sore throat'];
      break;
    case 'chest':
      symptoms = appData.symptoms.find(s => s.category === 'Respiratory').items;
      break;
    case 'abdomen':
      symptoms = appData.symptoms.find(s => s.category === 'Digestive').items;
      break;
    case 'general':
      symptoms = appData.symptoms.find(s => s.category === 'General').items;
      break;
    default:
      symptoms = ['Pain', 'Swelling', 'Numbness', 'Stiffness'];
  }
  
  symptomList.innerHTML = '';
  symptoms.forEach(symptom => {
    const symptomElement = document.createElement('button');
    symptomElement.className = 'symptom-item';
    symptomElement.textContent = symptom;
    symptomList.appendChild(symptomElement);
  });
}

function toggleSymptom(element) {
  element.classList.toggle('selected');
  
  const selectedSymptoms = document.querySelectorAll('.symptom-item.selected');
  const nextBtn = document.getElementById('symptom-next');
  
  if (nextBtn) {
    nextBtn.disabled = selectedSymptoms.length === 0;
  }
  
  symptomData.symptoms = Array.from(selectedSymptoms).map(el => el.textContent);
}

function proceedToSeverity() {
  showSymptomStep(3);
}

function selectSeverity(element) {
  document.querySelectorAll('.severity-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  element.classList.add('selected');
  
  const severity = element.dataset.severity;
  symptomData.severity = severity;
  console.log('Selected severity:', severity);
  
  setTimeout(() => {
    generateAssessment();
    showSymptomStep('results');
  }, 500);
}

function generateAssessment() {
  const assessmentContainer = document.getElementById('symptom-assessment');
  if (!assessmentContainer) return;
  
  let recommendation = '';
  let urgency = '';
  
  switch (symptomData.severity) {
    case 'mild':
      recommendation = 'Your symptoms appear mild. Consider monitoring them and schedule a routine appointment if they persist.';
      urgency = 'Low Priority';
      break;
    case 'moderate':
      recommendation = 'Your symptoms warrant medical attention. Schedule an appointment with your healthcare provider within the next few days.';
      urgency = 'Medium Priority';
      break;
    case 'severe':
      recommendation = 'Your symptoms are concerning and require prompt medical attention. Schedule an appointment as soon as possible.';
      urgency = 'High Priority';
      break;
    case 'critical':
      recommendation = 'Your symptoms may require immediate medical attention. Consider calling emergency services or visiting an emergency room.';
      urgency = 'Emergency';
      break;
  }
  
  const urgencyClass = symptomData.severity === 'critical' ? 'text-error' : 
                      symptomData.severity === 'severe' ? 'text-warning' : 'text-success';
  
  assessmentContainer.innerHTML = `
    <div class="assessment-result">
      <h4>Assessment Summary</h4>
      <p><strong>Body Area:</strong> ${symptomData.bodyPart}</p>
      <p><strong>Symptoms:</strong> ${symptomData.symptoms.join(', ')}</p>
      <p><strong>Severity:</strong> <span class="${urgencyClass}">${urgency}</span></p>
      <div class="recommendation">
        <h4>Recommendation</h4>
        <p>${recommendation}</p>
      </div>
    </div>
  `;
}

function showSymptomStep(step) {
  document.querySelectorAll('#symptom-checker .step').forEach(stepEl => {
    stepEl.classList.remove('active');
  });
  
  const stepId = step === 'results' ? 'symptom-results' : `symptom-step-${step}`;
  const stepEl = document.getElementById(stepId);
  if (stepEl) {
    stepEl.classList.add('active');
  }
}

// Video Call
function setupVideoCallListeners() {
  document.addEventListener('click', function(event) {
    switch(event.target.id) {
      case 'end-call':
        endVideoCall();
        break;
      case 'toggle-mic':
        toggleControl(event.target, 'Microphone');
        break;
      case 'toggle-camera':
        toggleControl(event.target, 'Camera');
        break;
      case 'share-screen':
        simulateScreenShare();
        break;
      case 'toggle-chat':
        toggleCallChat();
        break;
    }
  });
}

function startVideoCall() {
  console.log('Starting video call');
  showPage('video-call');
  startCallTimer();
  
  // Simulate connection process
  setTimeout(() => {
    showConnectionStatus('Connecting...', 'fair');
  }, 1000);
  
  setTimeout(() => {
    showConnectionStatus('Connected', 'good');
  }, 3000);
}

function startCallTimer() {
  callStartTime = Date.now();
  callTimer = setInterval(updateCallDuration, 1000);
}

function updateCallDuration() {
  const durationEl = document.getElementById('call-duration');
  if (!durationEl) return;
  
  const duration = Date.now() - callStartTime;
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  
  durationEl.textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endVideoCall() {
  showConfirmationModal(
    'End Call',
    'Are you sure you want to end this call?',
    () => {
      if (callTimer) {
        clearInterval(callTimer);
        callTimer = null;
      }
      
      const returnPage = currentUserType === 'patient' ? 'patient-dashboard' : 'doctor-dashboard';
      showPage(returnPage);
    }
  );
}

function toggleControl(button, controlName) {
  button.classList.toggle('active');
  const isActive = button.classList.contains('active');
  
  // Show feedback
  showConnectionStatus(
    `${controlName} ${isActive ? 'enabled' : 'disabled'}`, 
    'good'
  );
}

function simulateScreenShare() {
  showConnectionStatus('Screen sharing started', 'good');
}

function toggleCallChat() {
  const callChat = document.getElementById('call-chat');
  if (callChat) {
    callChat.classList.toggle('hidden');
  }
}

function showConnectionStatus(message, quality) {
  const statusEl = document.querySelector('.connection-status span:last-child');
  const indicatorEl = document.querySelector('.status-indicator');
  
  if (statusEl) {
    statusEl.textContent = `Connection: ${message}`;
  }
  
  if (indicatorEl) {
    indicatorEl.className = `status-indicator ${quality}`;
  }
  
  setTimeout(() => {
    if (statusEl) {
      statusEl.textContent = 'Connection: Good';
    }
    if (indicatorEl) {
      indicatorEl.className = 'status-indicator good';
    }
  }, 3000);
}

// Chat System
function setupChatListeners() {
  document.addEventListener('click', function(event) {
    switch(event.target.id) {
      case 'send-message':
        sendMessage();
        break;
      case 'urgent-message':
        toggleUrgentMessage();
        break;
    }
  });
  
  document.addEventListener('keypress', function(event) {
    if (event.target.id === 'message-input' && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
}

function setupChatInterface() {
  console.log('Setting up chat interface');
  loadChatMessages();
}

function loadChatMessages() {
  const chatContainer = document.getElementById('chat-messages');
  if (!chatContainer) return;
  
  chatContainer.innerHTML = '';
  
  const relevantMessages = appData.chatMessages.filter(msg => 
    (currentUserType === 'patient' && msg.patientId === currentPatient.id) ||
    (currentUserType === 'doctor' && msg.doctorId === currentDoctor.id)
  );
  
  relevantMessages.forEach(msg => {
    const messageEl = document.createElement('div');
    const isFromCurrentUser = (currentUserType === 'patient' && msg.sender === 'patient') ||
                             (currentUserType === 'doctor' && msg.sender === 'doctor');
    
    messageEl.className = `message ${isFromCurrentUser ? 'sent' : 'received'}`;
    messageEl.innerHTML = `
      <div class="message-content">${msg.message}</div>
      <div class="message-time ${isFromCurrentUser ? 'sent' : ''}">${formatTime(msg.timestamp)}</div>
    `;
    
    chatContainer.appendChild(messageEl);
  });
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
  const messageInput = document.getElementById('message-input');
  if (!messageInput) return;
  
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  const newMessage = {
    id: appData.chatMessages.length + 1,
    patientId: currentUserType === 'patient' ? currentPatient.id : 1,
    doctorId: currentUserType === 'doctor' ? currentDoctor.id : 1,
    sender: currentUserType,
    message: message,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  appData.chatMessages.push(newMessage);
  messageInput.value = '';
  
  // Add message to UI
  const chatContainer = document.getElementById('chat-messages');
  if (chatContainer) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    messageEl.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-time sent">${formatTime(newMessage.timestamp)}</div>
    `;
    
    chatContainer.appendChild(messageEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  // Simulate response (for demo purposes)
  if (currentUserType === 'patient') {
    setTimeout(simulateDoctorResponse, 2000);
  }
}

function simulateDoctorResponse() {
  const responses = [
    "Thank you for the update. I'll review this information.",
    "That's helpful information. Let me know if you have any other symptoms.",
    "I understand. We can discuss this further during your next appointment.",
    "Please continue monitoring and keep me informed of any changes."
  ];
  
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  const newMessage = {
    id: appData.chatMessages.length + 1,
    patientId: currentPatient.id,
    doctorId: 1,
    sender: 'doctor',
    message: response,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  appData.chatMessages.push(newMessage);
  
  const chatContainer = document.getElementById('chat-messages');
  if (chatContainer) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message received';
    messageEl.innerHTML = `
      <div class="message-content">${response}</div>
      <div class="message-time">${formatTime(newMessage.timestamp)}</div>
    `;
    
    chatContainer.appendChild(messageEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

function toggleUrgentMessage() {
  const button = document.getElementById('urgent-message');
  if (!button) return;
  
  button.classList.toggle('active');
  
  if (button.classList.contains('active')) {
    button.textContent = '🚨 Urgent (ON)';
  } else {
    button.textContent = '🚨 Urgent';
  }
}

// Appointments List
function setupAppointmentsList() {
  console.log('Setting up appointments list');
  const appointmentsContainer = document.getElementById('appointments-content');
  if (!appointmentsContainer) return;
  
  appointmentsContainer.innerHTML = '';
  
  const userAppointments = appData.appointments.filter(apt => 
    currentUserType === 'patient' ? apt.patientId === currentPatient.id : apt.doctorId === currentDoctor.id
  );
  
  if (userAppointments.length === 0) {
    appointmentsContainer.innerHTML = '<p>No appointments scheduled.</p>';
    return;
  }
  
  userAppointments.forEach(appointment => {
    const doctor = appData.doctors.find(d => d.id === appointment.doctorId);
    const patient = appData.patients.find(p => p.id === appointment.patientId);
    
    const appointmentCard = document.createElement('div');
    appointmentCard.className = 'appointment-card';
    appointmentCard.innerHTML = `
      <div class="appointment-header">
        <div class="appointment-date">${formatDate(appointment.date)} at ${appointment.time}</div>
        <div class="appointment-status ${appointment.status.toLowerCase()}">${appointment.status}</div>
      </div>
      <div class="appointment-details">
        <div class="appointment-detail">
          <strong>${currentUserType === 'patient' ? 'Doctor' : 'Patient'}</strong>
          <span>${currentUserType === 'patient' ? doctor?.name : patient?.name}</span>
        </div>
        <div class="appointment-detail">
          <strong>Type</strong>
          <span>${appointment.type}</span>
        </div>
        <div class="appointment-detail">
          <strong>Reason</strong>
          <span>${appointment.reason}</span>
        </div>
      </div>
    `;
    
    appointmentsContainer.appendChild(appointmentCard);
  });
}

// Medical Records
function setupMedicalRecordsTabs() {
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('tab-btn')) {
      const tabName = event.target.dataset.tab;
      switchTab(tabName);
    }
  });
}

function setupMedicalRecords() {
  console.log('Setting up medical records');
  switchTab('overview');
  populatePatientInfo();
  populateConditions();
}

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Update tab content
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
    pane.classList.add('hidden');
  });
  
  const activePane = document.getElementById(`${tabName}-tab`);
  if (activePane) {
    activePane.classList.remove('hidden');
    activePane.classList.add('active');
  }
}

function populatePatientInfo() {
  const infoContainer = document.getElementById('patient-info-content');
  if (!infoContainer) return;
  
  const patient = currentUserType === 'patient' ? currentPatient : appData.patients[0];
  
  infoContainer.innerHTML = `
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Full Name</div>
        <div class="info-value">${patient.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Age</div>
        <div class="info-value">${patient.age} years</div>
      </div>
      <div class="info-item">
        <div class="info-label">Location</div>
        <div class="info-value">${patient.location}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Phone</div>
        <div class="info-value">${patient.phone}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${patient.email}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Last Visit</div>
        <div class="info-value">${formatDate(patient.lastVisit)}</div>
      </div>
    </div>
  `;
}

function populateConditions() {
  const conditionsContainer = document.getElementById('conditions-content');
  if (!conditionsContainer) return;
  
  const patient = currentUserType === 'patient' ? currentPatient : appData.patients[0];
  
  conditionsContainer.innerHTML = '';
  
  if (patient.conditions.length === 0) {
    conditionsContainer.innerHTML = '<p>No chronic conditions recorded.</p>';
    return;
  }
  
  patient.conditions.forEach(condition => {
    const conditionEl = document.createElement('div');
    conditionEl.className = 'condition-item';
    conditionEl.innerHTML = `
      <div class="condition-name">${condition}</div>
      <div class="condition-date">Diagnosed: Ongoing care</div>
    `;
    conditionsContainer.appendChild(conditionEl);
  });
}

// Doctor-specific functions
function setupDoctorAppointments() {
  setupAppointmentsList(); 
}

function setupDoctorPatientRecords() {
  setupMedicalRecords(); 
}

function setupDoctorChat() {
  setupChatInterface(); 
}

function showScheduleManagement() {
  showConfirmationModal(
    'Schedule Management',
    'Schedule management feature would allow doctors to set their availability, block time slots, and manage recurring appointments.',
    () => showPage('doctor-dashboard')
  );
}

function showPatientSearch() {
  showConfirmationModal(
    'Patient Search',
    'Patient search feature would allow doctors to quickly find patient records, view their medical history, and access contact information.',
    () => showPage('doctor-dashboard')
  );
}

// Modal System
function setupModalListeners() {
  const modal = document.getElementById('confirmation-modal');
  const cancelBtn = document.getElementById('modal-cancel');
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideModal);
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideModal();
      }
    });
  }
}

function showConfirmationModal(title, message, onConfirm) {
  const modal = document.getElementById('confirmation-modal');
  const titleEl = document.getElementById('modal-title');
  const messageEl = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm');
  
  if (!modal || !titleEl || !messageEl || !confirmBtn) return;
  
  titleEl.textContent = title;
  messageEl.textContent = message;
  
  // Remove old listeners and add new one
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  
  newConfirmBtn.addEventListener('click', function() {
    hideModal();
    if (onConfirm) onConfirm();
  });
  
  modal.classList.remove('hidden');
}

function hideModal() {
  const modal = document.getElementById('confirmation-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

// Accessibility Enhancements
document.addEventListener('keydown', function(e) {
  // Escape key to close modals
  if (e.key === 'Escape') {
    const modal = document.getElementById('confirmation-modal');
    if (modal && !modal.classList.contains('hidden')) {
      hideModal();
    }
    
    const emergencyBanner = document.getElementById('emergency-banner');
    if (emergencyBanner && !emergencyBanner.classList.contains('hidden')) {
      hideEmergencyBanner();
    }
  }
  
  // Tab navigation enhancement
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

// Remove keyboard navigation class when mouse is used
document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

// Initialize focus management
function manageFocus(targetPage) {
  setTimeout(() => {
    const firstFocusable = document.querySelector(`#${targetPage} button, #${targetPage} input, #${targetPage} select, #${targetPage} textarea, #${targetPage} [tabindex="0"]`);
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }, 100);
}
// Rural Healthcare System - Main Application JavaScript

class RuralHealthcareApp {
    constructor() {
        this.currentUser = null;
        this.currentScreen = 'login-screen';
        this.isOnline = navigator.onLine;
        this.selectedSymptoms = [];
        this.callDuration = 0;
        this.callTimer = null;
        this.currentLanguage = 'en';
        this.pwaBannerDismissed = false;
        
        // Sample data from JSON
        this.data = {
            patients: [
                {
                    id: "p001",
                    name: "Priya Sharma",
                    age: 28,
                    location: "Rajasthan Rural",
                    phone: "+91-9876543210",
                    email: "priya.sharma@example.com",
                    medicalHistory: ["Diabetes Type 2", "Hypertension"],
                    appointments: [
                        {
                            id: "apt001",
                            doctorId: "d001",
                            doctorName: "Dr. Anjali Verma",
                            date: "2025-08-25",
                            time: "10:00",
                            status: "confirmed",
                            purpose: "Diabetes checkup"
                        }
                    ],
                    prescriptions: [
                        {
                            medication: "Metformin",
                            dosage: "500mg",
                            frequency: "Twice daily",
                            duration: "30 days",
                            prescribedBy: "Dr. Anjali Verma",
                            date: "2025-08-15"
                        }
                    ]
                },
                {
                    id: "p002", 
                    name: "Ram Singh",
                    age: 45,
                    location: "Punjab Rural",
                    phone: "+91-9123456789",
                    email: "ram.singh@example.com",
                    medicalHistory: ["Arthritis", "High Cholesterol"],
                    appointments: [
                        {
                            id: "apt002",
                            doctorId: "d002",
                            doctorName: "Dr. Rajesh Kumar",
                            date: "2025-08-26",
                            time: "14:00",
                            status: "pending",
                            purpose: "Joint pain consultation"
                        }
                    ],
                    prescriptions: []
                }
            ],
            doctors: [
                {
                    id: "d001",
                    name: "Dr. Anjali Verma",
                    specialization: "Endocrinologist",
                    experience: "8 years",
                    rating: 4.8,
                    location: "Mumbai",
                    languages: ["English", "Hindi", "Marathi"],
                    email: "anjali.verma@hospital.com",
                    patients: ["p001"],
                    availability: {
                        monday: ["09:00-12:00", "14:00-17:00"],
                        tuesday: ["09:00-12:00", "14:00-17:00"],
                        wednesday: ["09:00-12:00"],
                        thursday: ["09:00-12:00", "14:00-17:00"],
                        friday: ["09:00-12:00", "14:00-17:00"]
                    }
                },
                {
                    id: "d002",
                    name: "Dr. Rajesh Kumar",
                    specialization: "Orthopedist",
                    experience: "12 years",
                    rating: 4.6,
                    location: "Delhi",
                    languages: ["English", "Hindi", "Punjabi"],
                    email: "rajesh.kumar@hospital.com",
                    patients: ["p002"],
                    availability: {
                        monday: ["10:00-13:00", "15:00-18:00"],
                        tuesday: ["10:00-13:00", "15:00-18:00"],
                        thursday: ["10:00-13:00", "15:00-18:00"],
                        friday: ["10:00-13:00", "15:00-18:00"],
                        saturday: ["10:00-13:00"]
                    }
                }
            ],
            symptomChecker: {
                symptoms: [
                    "Fever", "Headache", "Cough", "Chest pain", "Shortness of breath",
                    "Nausea", "Vomiting", "Abdominal pain", "Diarrhea", "Fatigue",
                    "Joint pain", "Muscle aches", "Skin rash", "Dizziness", "Sore throat"
                ],
                conditions: [
                    {
                        name: "Common Cold",
                        symptoms: ["Cough", "Sore throat", "Headache", "Fatigue"],
                        severity: "Low",
                        recommendation: "Rest, fluids, over-the-counter medication. Consult doctor if symptoms worsen."
                    },
                    {
                        name: "Flu",
                        symptoms: ["Fever", "Muscle aches", "Fatigue", "Cough", "Headache"],
                        severity: "Medium",
                        recommendation: "Rest, fluids, antiviral medication. Consult doctor for proper treatment."
                    },
                    {
                        name: "Food Poisoning",
                        symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain"],
                        severity: "Medium",
                        recommendation: "Stay hydrated, bland diet. Seek medical attention if severe dehydration."
                    }
                ]
            },
            chatbotResponses: {
                greetings: [
                    "Hello! I'm your health assistant. How can I help you today?",
                    "Hi there! I'm here to help with your health questions. What would you like to know?"
                ],
                symptoms: {
                    fever: "Fever can be caused by infections, inflammation, or other conditions. If you have a high fever (above 101°F/38.3°C) or it persists for more than 3 days, please consult a doctor.",
                    headache: "Headaches can be caused by stress, dehydration, eye strain, or other factors. Try resting in a dark room, staying hydrated, and applying a cold compress. If severe or persistent, consult a doctor.",
                    cough: "Coughs can be dry or productive. Stay hydrated, use honey for soothing, and consider a humidifier. If cough persists for more than 2 weeks or is accompanied by fever, consult a doctor."
                },
                general: [
                    "I recommend speaking with a healthcare professional for a proper diagnosis.",
                    "Your symptoms could have various causes. A doctor can provide the best guidance.",
                    "Please consider booking an appointment with a doctor for personalized advice."
                ]
            },
            systemAnalytics: {
                totalPatients: 15847,
                totalDoctors: 234,
                totalAppointments: 8932,
                completedConsultations: 7651,
                pendingAppointments: 456,
                averageRating: 4.7,
                monthlyGrowth: 12.5,
                popularSpecialties: [
                    {name: "General Medicine", count: 2456},
                    {name: "Pediatrics", count: 1876},
                    {name: "Gynecology", count: 1654},
                    {name: "Cardiology", count: 1234},
                    {name: "Dermatology", count: 987}
                ]
            },
            languages: [
                {code: "en", name: "English"},
                {code: "hi", name: "हिंदी"},
                {code: "bn", name: "বাংলা"},
                {code: "te", name: "తెలుగు"},
                {code: "mr", name: "मराठी"},
                {code: "ta", name: "তামিল"},
                {code: "gu", name: "ગુજરાતী"},
                {code: "kn", name: "ಕನ್ನಡ"},
                {code: "or", name: "ଓଡ଼ିଆ"},
                {code: "pa", name: "ਪੰਜਾਬੀ"}
            ]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupOnlineOfflineDetection();
        this.initializeLanguageSelector();
        this.setupModalHandling();
        setTimeout(() => this.showPWABanner(), 3000);
        this.simulateRealTimeNotifications();
    }

    setupEventListeners() {
        // Login/Register forms
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // Logout buttons
        const patientLogout = document.getElementById('patient-logout');
        const doctorLogout = document.getElementById('doctor-logout');
        const adminLogout = document.getElementById('admin-logout');
        
        if (patientLogout) patientLogout.addEventListener('click', () => this.logout());
        if (doctorLogout) doctorLogout.addEventListener('click', () => this.logout());
        if (adminLogout) adminLogout.addEventListener('click', () => this.logout());

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e));
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Appointment booking
        const appointmentForm = document.getElementById('appointment-form');
        const cancelAppointment = document.getElementById('cancel-appointment');
        
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => this.handleAppointmentBooking(e));
        }
        if (cancelAppointment) {
            cancelAppointment.addEventListener('click', () => this.closeModal());
        }

        // Symptom checker
        const analyzeSymptoms = document.getElementById('analyze-symptoms');
        const backToSymptoms = document.getElementById('back-to-symptoms');
        const bookFromSymptoms = document.getElementById('book-from-symptoms');
        
        if (analyzeSymptoms) analyzeSymptoms.addEventListener('click', () => this.analyzeSymptoms());
        if (backToSymptoms) backToSymptoms.addEventListener('click', () => this.backToSymptoms());
        if (bookFromSymptoms) bookFromSymptoms.addEventListener('click', () => this.bookFromSymptoms());

        // Chatbot
        const sendChat = document.getElementById('send-chat');
        const chatInput = document.getElementById('chat-input-field');
        const voiceInput = document.getElementById('voice-input');
        
        if (sendChat) sendChat.addEventListener('click', () => this.sendChatMessage());
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
        }
        if (voiceInput) voiceInput.addEventListener('click', () => this.startVoiceInput());

        // Video call controls
        const muteAudio = document.getElementById('mute-audio');
        const toggleVideo = document.getElementById('toggle-video');
        const endCall = document.getElementById('end-call');
        const shareScreen = document.getElementById('share-screen');
        
        if (muteAudio) muteAudio.addEventListener('click', () => this.toggleAudio());
        if (toggleVideo) toggleVideo.addEventListener('click', () => this.toggleVideo());
        if (endCall) endCall.addEventListener('click', () => this.endCall());
        if (shareScreen) shareScreen.addEventListener('click', () => this.shareScreen());

        // Prescription form
        const prescriptionForm = document.getElementById('prescription-form');
        const addMedication = document.getElementById('add-medication');
        
        if (prescriptionForm) prescriptionForm.addEventListener('submit', (e) => this.handlePrescription(e));
        if (addMedication) addMedication.addEventListener('click', () => this.addMedicationField());

        // Language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => this.changeLanguage(e));
        }

        // PWA install
        const installApp = document.getElementById('install-app');
        const dismissBanner = document.getElementById('dismiss-banner');
        
        if (installApp) installApp.addEventListener('click', () => this.installPWA());
        if (dismissBanner) dismissBanner.addEventListener('click', () => this.dismissPWABanner());

        // Admin actions
        document.querySelectorAll('.admin-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAdminAction(e));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Emergency shortcut: Ctrl + Shift + E
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                this.handleEmergency();
            }
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupModalHandling() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
            
            // Prevent clicks inside modal content from closing modal
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
    }

    setupOnlineOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hideOfflineIndicator();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineIndicator();
        });
    }

    showOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    syncOfflineData() {
        this.showMessage('Data synchronized successfully', 'success');
    }

    initializeLanguageSelector() {
        const select = document.getElementById('language-select');
        if (select && select.children.length <= 1) {
            this.data.languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                select.appendChild(option);
            });
        }
    }

    changeLanguage(e) {
        this.currentLanguage = e.target.value;
        this.showMessage(`Language changed to ${e.target.options[e.target.selectedIndex].text}`, 'info');
    }

    switchTab(e) {
        e.preventDefault();
        const tabName = e.target.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Update forms
        document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
        const targetForm = document.getElementById(`${tabName}-form`);
        if (targetForm) {
            targetForm.classList.add('active');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('user-role').value;

        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            
            // Mock authentication
            if (role === 'patient') {
                this.currentUser = {...this.data.patients[0]};
                this.currentUser.role = 'patient';
                this.showPatientDashboard();
            } else if (role === 'doctor') {
                this.currentUser = {...this.data.doctors[0]};
                this.currentUser.role = 'doctor';
                this.showDoctorDashboard();
            } else if (role === 'admin') {
                this.currentUser = { name: 'Admin User', role: 'admin' };
                this.showAdminDashboard();
            }

            this.showMessage(`Welcome, ${this.currentUser.name || 'User'}!`, 'success');
        }, 1000);
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const phone = document.getElementById('reg-phone').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const location = document.getElementById('reg-location').value;

        if (!name || !phone || !email || !password || !location) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            this.hideLoading();
            this.showMessage('Registration successful! Please login.', 'success');
            document.querySelector('.tab-btn[data-tab="login"]')?.click();
        }, 1000);
    }

    showPatientDashboard() {
        this.switchScreen('patient-dashboard');
        const patientName = document.getElementById('patient-name');
        if (patientName) {
            patientName.textContent = `Welcome, ${this.currentUser.name}`;
        }
        this.populatePatientData();
    }

    showDoctorDashboard() {
        this.switchScreen('doctor-dashboard');
        const doctorName = document.getElementById('doctor-name');
        if (doctorName) {
            doctorName.textContent = this.currentUser.name;
        }
        this.populateDoctorData();
    }

    showAdminDashboard() {
        this.switchScreen('admin-dashboard');
        this.populateAdminData();
    }

    populatePatientData() {
        // Populate appointments
        const appointmentsList = document.getElementById('patient-appointments');
        if (appointmentsList && this.currentUser.appointments) {
            appointmentsList.innerHTML = '';
            this.currentUser.appointments.forEach(apt => {
                const aptElement = document.createElement('div');
                aptElement.className = 'appointment-item';
                aptElement.innerHTML = `
                    <div class="appointment-info">
                        <h5>${apt.doctorName}</h5>
                        <p>${apt.date} at ${apt.time}</p>
                        <p>${apt.purpose}</p>
                    </div>
                    <span class="status status--${apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'error'}">
                        ${apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                `;
                appointmentsList.appendChild(aptElement);
            });
        }

        // Populate prescriptions
        const prescriptionsList = document.getElementById('patient-prescriptions');
        if (prescriptionsList && this.currentUser.prescriptions) {
            prescriptionsList.innerHTML = '';
            this.currentUser.prescriptions.forEach(prescription => {
                const prescElement = document.createElement('div');
                prescElement.className = 'prescription-item';
                prescElement.innerHTML = `
                    <h5>${prescription.medication}</h5>
                    <p>${prescription.dosage} - ${prescription.frequency}</p>
                    <p>Duration: ${prescription.duration}</p>
                `;
                prescriptionsList.appendChild(prescElement);
            });
        }
    }

    populateDoctorData() {
        // Update statistics
        const patientsCount = this.currentUser.patients ? this.currentUser.patients.length : 0;
        const patientsCountEl = document.getElementById('doctor-patients-count');
        const appointmentsTodayEl = document.getElementById('doctor-appointments-today');
        const pendingCountEl = document.getElementById('doctor-pending-count');
        
        if (patientsCountEl) patientsCountEl.textContent = patientsCount;
        if (appointmentsTodayEl) appointmentsTodayEl.textContent = '8';
        if (pendingCountEl) pendingCountEl.textContent = '3';

        // Populate appointments
        const appointmentsList = document.getElementById('doctor-appointments');
        if (appointmentsList) {
            appointmentsList.innerHTML = '';
            const todayAppointments = [
                {
                    patientName: 'Priya Sharma',
                    time: '10:00',
                    purpose: 'Diabetes checkup',
                    status: 'confirmed'
                },
                {
                    patientName: 'Ram Singh',
                    time: '14:00',
                    purpose: 'Joint pain consultation',
                    status: 'pending'
                }
            ];

            todayAppointments.forEach(apt => {
                const aptElement = document.createElement('div');
                aptElement.className = 'appointment-item';
                aptElement.innerHTML = `
                    <div class="appointment-info">
                        <h5>${apt.patientName}</h5>
                        <p>${apt.time} - ${apt.purpose}</p>
                    </div>
                    <div class="appointment-actions">
                        ${apt.status === 'pending' ? `
                            <button class="btn btn--sm btn--primary" onclick="app.approveAppointment('${apt.patientName}')">Approve</button>
                            <button class="btn btn--sm btn--secondary" onclick="app.rejectAppointment('${apt.patientName}')">Reject</button>
                        ` : `
                            <button class="btn btn--sm btn--primary" onclick="app.startVideoCall('${apt.patientName}')">Start Call</button>
                        `}
                    </div>
                `;
                appointmentsList.appendChild(aptElement);
            });
        }
    }

    populateAdminData() {
        const analytics = this.data.systemAnalytics;
        const totalPatientsEl = document.getElementById('total-patients');
        const totalDoctorsEl = document.getElementById('total-doctors');
        const totalAppointmentsEl = document.getElementById('total-appointments');
        const averageRatingEl = document.getElementById('average-rating');
        
        if (totalPatientsEl) totalPatientsEl.textContent = analytics.totalPatients.toLocaleString();
        if (totalDoctorsEl) totalDoctorsEl.textContent = analytics.totalDoctors.toLocaleString();
        if (totalAppointmentsEl) totalAppointmentsEl.textContent = analytics.totalAppointments.toLocaleString();
        if (averageRatingEl) averageRatingEl.textContent = analytics.averageRating;
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        this.currentScreen = screenId;
    }

    logout() {
        this.currentUser = null;
        this.switchScreen('login-screen');
        this.showMessage('Logged out successfully', 'info');
    }

    handleQuickAction(e) {
        e.preventDefault();
        const action = e.currentTarget.dataset.action;
        
        switch (action) {
            case 'book-appointment':
                this.openAppointmentModal();
                break;
            case 'symptom-checker':
                this.openSymptomChecker();
                break;
            case 'ai-chat':
                this.openChatbot();
                break;
            case 'emergency':
                this.handleEmergency();
                break;
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const nav = e.currentTarget.dataset.nav;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        this.showMessage(`Navigated to ${nav}`, 'info');
    }

    openAppointmentModal() {
        const modal = document.getElementById('appointment-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        // Populate doctors dropdown
        const doctorSelect = document.getElementById('appointment-doctor');
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Choose a doctor...</option>';
            
            this.data.doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.name} - ${doctor.specialization}`;
                doctorSelect.appendChild(option);
            });

            // Populate time slots when doctor is selected
            doctorSelect.addEventListener('change', (e) => {
                const timeSelect = document.getElementById('appointment-time');
                if (timeSelect && e.target.value) {
                    timeSelect.innerHTML = '<option value="">Select time...</option>';
                    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
                    timeSlots.forEach(time => {
                        const option = document.createElement('option');
                        option.value = time;
                        option.textContent = time;
                        timeSelect.appendChild(option);
                    });
                }
            });
        }

        // Set minimum date to today
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    handleAppointmentBooking(e) {
        e.preventDefault();
        
        const doctorId = document.getElementById('appointment-doctor')?.value;
        const date = document.getElementById('appointment-date')?.value;
        const time = document.getElementById('appointment-time')?.value;
        const purpose = document.getElementById('appointment-purpose')?.value;

        if (!doctorId || !date || !time || !purpose) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            this.hideLoading();
            this.closeModal();
            this.showMessage('Appointment booked successfully!', 'success');
            
            if (this.currentUser && this.currentUser.appointments) {
                const doctor = this.data.doctors.find(d => d.id === doctorId);
                const newAppointment = {
                    id: `apt${Date.now()}`,
                    doctorId,
                    doctorName: doctor ? doctor.name : 'Unknown Doctor',
                    date,
                    time,
                    status: 'pending',
                    purpose
                };
                
                this.currentUser.appointments.push(newAppointment);
                this.populatePatientData();
            }
        }, 1000);
    }

    openSymptomChecker() {
        const modal = document.getElementById('symptom-checker-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        // Populate symptoms grid
        const symptomsGrid = document.getElementById('symptoms-grid');
        if (symptomsGrid) {
            symptomsGrid.innerHTML = '';
            
            this.data.symptomChecker.symptoms.forEach(symptom => {
                const symptomBtn = document.createElement('button');
                symptomBtn.className = 'symptom-btn';
                symptomBtn.textContent = symptom;
                symptomBtn.type = 'button';
                symptomBtn.addEventListener('click', () => this.toggleSymptom(symptomBtn, symptom));
                symptomsGrid.appendChild(symptomBtn);
            });
        }

        // Reset to first step
        document.querySelectorAll('#symptom-checker-modal .step').forEach(step => step.classList.remove('active'));
        const inputStep = document.getElementById('symptom-input-step');
        if (inputStep) {
            inputStep.classList.add('active');
        }
        this.selectedSymptoms = [];
    }

    toggleSymptom(btn, symptom) {
        if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
            this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
        } else {
            btn.classList.add('selected');
            this.selectedSymptoms.push(symptom);
        }
    }

    analyzeSymptoms() {
        if (this.selectedSymptoms.length === 0) {
            this.showMessage('Please select at least one symptom', 'error');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            this.hideLoading();
            
            const matches = this.data.symptomChecker.conditions.filter(condition => {
                return condition.symptoms.some(symptom => this.selectedSymptoms.includes(symptom));
            });

            const resultsContainer = document.getElementById('symptom-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '';

                if (matches.length === 0) {
                    resultsContainer.innerHTML = '<p>No matching conditions found. Please consult a doctor for proper diagnosis.</p>';
                } else {
                    matches.forEach(condition => {
                        const resultElement = document.createElement('div');
                        resultElement.className = `condition-result ${condition.severity.toLowerCase()}-severity`;
                        resultElement.innerHTML = `
                            <span class="severity-badge severity-${condition.severity.toLowerCase()}">${condition.severity} Risk</span>
                            <h5>${condition.name}</h5>
                            <p>${condition.recommendation}</p>
                        `;
                        resultsContainer.appendChild(resultElement);
                    });
                }
            }

            // Switch to results step
            const inputStep = document.getElementById('symptom-input-step');
            const resultsStep = document.getElementById('symptom-results-step');
            if (inputStep) inputStep.classList.remove('active');
            if (resultsStep) resultsStep.classList.add('active');
        }, 1500);
    }

    backToSymptoms() {
        const inputStep = document.getElementById('symptom-input-step');
        const resultsStep = document.getElementById('symptom-results-step');
        if (resultsStep) resultsStep.classList.remove('active');
        if (inputStep) inputStep.classList.add('active');
    }

    bookFromSymptoms() {
        this.closeModal();
        this.openAppointmentModal();
    }

    openChatbot() {
        const modal = document.getElementById('chatbot-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages && chatMessages.children.length === 0) {
            this.addChatMessage('bot', this.data.chatbotResponses.greetings[0]);
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input-field');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        this.addChatMessage('user', message);
        input.value = '';
        
        setTimeout(() => {
            const response = this.generateBotResponse(message);
            this.addChatMessage('bot', response);
        }, 1000);
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">${message}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        for (const [symptom, response] of Object.entries(this.data.chatbotResponses.symptoms)) {
            if (message.includes(symptom)) {
                return response;
            }
        }
        
        return this.data.chatbotResponses.general[Math.floor(Math.random() * this.data.chatbotResponses.general.length)];
    }

    startVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            this.showMessage('Voice input not supported in this browser', 'error');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

        const voiceBtn = document.getElementById('voice-input');
        if (voiceBtn) {
            recognition.onstart = () => {
                voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const chatInput = document.getElementById('chat-input-field');
                if (chatInput) {
                    chatInput.value = transcript;
                }
            };

            recognition.onend = () => {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            recognition.start();
        }
    }

    startVideoCall(patientName) {
        const modal = document.getElementById('video-call-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        const callTitle = document.getElementById('call-title');
        if (callTitle) {
            callTitle.textContent = `Video Call with ${patientName}`;
        }
        
        this.callDuration = 0;
        this.updateCallDuration();
        this.callTimer = setInterval(() => {
            this.callDuration++;
            this.updateCallDuration();
        }, 1000);

        this.showMessage('Connecting to video call...', 'info');
    }

    updateCallDuration() {
        const minutes = Math.floor(this.callDuration / 60);
        const seconds = this.callDuration % 60;
        const durationEl = document.getElementById('call-duration');
        if (durationEl) {
            durationEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    toggleAudio() {
        const btn = document.getElementById('mute-audio');
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-microphone')) {
                icon.className = 'fas fa-microphone-slash';
                this.showMessage('Microphone muted', 'info');
            } else {
                icon.className = 'fas fa-microphone';
                this.showMessage('Microphone unmuted', 'info');
            }
        }
    }

    toggleVideo() {
        const btn = document.getElementById('toggle-video');
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-video')) {
                icon.className = 'fas fa-video-slash';
                this.showMessage('Camera turned off', 'info');
            } else {
                icon.className = 'fas fa-video';
                this.showMessage('Camera turned on', 'info');
            }
        }
    }

    endCall() {
        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }
        
        this.closeModal();
        this.showMessage('Call ended', 'info');
    }

    shareScreen() {
        this.showMessage('Screen sharing started', 'info');
    }

    approveAppointment(patientName) {
        this.showMessage(`Appointment with ${patientName} approved`, 'success');
        this.populateDoctorData();
    }

    rejectAppointment(patientName) {
        this.showMessage(`Appointment with ${patientName} rejected`, 'info');
        this.populateDoctorData();
    }

    handlePrescription(e) {
        e.preventDefault();
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            this.closeModal();
            this.showMessage('Prescription saved successfully', 'success');
        }, 1000);
    }

    addMedicationField() {
        const medicationsList = document.getElementById('medications-list');
        if (!medicationsList) return;
        
        const newMedication = document.createElement('div');
        newMedication.className = 'medication-item';
        newMedication.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <input type="text" class="form-control medication-name" placeholder="Medication name">
                </div>
                <div class="form-group">
                    <input type="text" class="form-control medication-dosage" placeholder="Dosage">
                </div>
                <div class="form-group">
                    <input type="text" class="form-control medication-frequency" placeholder="Frequency">
                </div>
                <button type="button" class="btn btn--secondary remove-medication" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        medicationsList.appendChild(newMedication);
    }

    handleAdminAction(e) {
        const action = e.currentTarget.dataset.action;
        
        switch (action) {
            case 'manage-users':
                this.showMessage('Opening user management...', 'info');
                break;
            case 'system-reports':
                this.showMessage('Generating system reports...', 'info');
                break;
            case 'settings':
                this.showMessage('Opening system settings...', 'info');
                break;
            case 'backup':
                this.showMessage('Starting data backup...', 'info');
                break;
        }
    }

    handleEmergency() {
        const emergencyNumber = '+91-112';
        this.showMessage(`Emergency services contacted: ${emergencyNumber}`, 'error');
    }

    closeModal() {
        // Close all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        
        // Reset symptom checker
        this.selectedSymptoms = [];
        
        // End any active call
        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('message-container');
        if (!container) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `toast-message ${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(messageElement);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    showPWABanner() {
        if (this.pwaBannerDismissed) return;
        
        const banner = document.getElementById('pwa-banner');
        if (banner && !window.matchMedia('(display-mode: standalone)').matches) {
            banner.classList.remove('hidden');
        }
    }

    installPWA() {
        this.showMessage('App installation started...', 'info');
        this.dismissPWABanner();
    }

    dismissPWABanner() {
        this.pwaBannerDismissed = true;
        const banner = document.getElementById('pwa-banner');
        if (banner) {
            banner.classList.add('hidden');
        }
    }

    simulateRealTimeNotifications() {
        const notifications = [
            'New appointment request received',
            'Prescription ready for pickup',
            'Health reminder: Take your medication',
            'Video call starting in 5 minutes'
        ];
        
        let index = 0;
        setInterval(() => {
            if (this.currentUser && Math.random() > 0.8) {
                this.showMessage(notifications[index % notifications.length], 'info');
                index++;
            }
        }, 45000); // Every 45 seconds
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RuralHealthcareApp();
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA install prompt handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    if (window.app) {
        window.app.showMessage('App installed successfully!', 'success');
    }
});

// Handle back button for modal navigation
window.addEventListener('popstate', (e) => {
    const openModal = document.querySelector('.modal:not(.hidden)');
    if (openModal) {
        openModal.classList.add('hidden');
    }
});
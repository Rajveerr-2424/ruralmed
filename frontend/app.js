
// ==========================
// Rural Telemedicine Connector - Frontend (API Connected)
// ==========================

const API_BASE_URL = "http://localhost:5000/api";
let currentUser = null;
let token = localStorage.getItem("token") || null;

// Utility function for API requests
async function apiRequest(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "API Error");
  return data;
}

// ==========================
// Authentication
// ==========================

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await apiRequest("/auth/login", "POST", { email, password });
    token = data.token;
    localStorage.setItem("token", token);
    currentUser = data.user;

    alert("✅ Login successful!");
    showPage(currentUser.role === "doctor" ? "doctor-dashboard" : "patient-dashboard");
  } catch (err) {
    alert("❌ " + err.message);
  }
}

async function register() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  try {
    await apiRequest("/auth/register", "POST", { name, email, password, role });
    alert("✅ Registration successful! You can now login.");
    showPage("login");
  } catch (err) {
    alert("❌ " + err.message);
  }
}

// ==========================
// Doctors
// ==========================

async function loadDoctors() {
  try {
    const doctors = await apiRequest("/doctors");
    const doctorList = document.getElementById("doctor-list");
    doctorList.innerHTML = "";

    doctors.forEach(doctor => {
      const card = document.createElement("div");
      card.className = "doctor-card";
      card.innerHTML = `
        <h4>${doctor.name}</h4>
        <p>${doctor.specialty}</p>
        <p>Experience: ${doctor.experience || 0} years</p>
        <button onclick="bookAppointment('${doctor._id}')">Book Appointment</button>
      `;
      doctorList.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading doctors:", err);
  }
}

// ==========================
// Appointments
// ==========================

async function bookAppointment(doctorId) {
  try {
    await apiRequest("/appointments", "POST", { doctorId, patientId: currentUser._id });
    alert("✅ Appointment booked!");
    loadAppointments();
  } catch (err) {
    alert("❌ " + err.message);
  }
}

async function loadAppointments() {
  try {
    const appointments = await apiRequest("/appointments");
    const list = document.getElementById("appointments-list");
    list.innerHTML = "";

    appointments.forEach(app => {
      const li = document.createElement("li");
      li.textContent = `${app.date} - ${app.patient?.name || "Unknown"} with ${app.doctor?.name || "Unknown"}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading appointments:", err);
  }
}

// ==========================
// Patients
// ==========================

async function loadProfile() {
  try {
    const profile = await apiRequest("/patients/profile");
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-email").textContent = profile.email;
  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

// ==========================
// Chat (Basic Stub)
// ==========================

async function sendMessage(appointmentId, message) {
  try {
    await apiRequest(`/chat/${appointmentId}`, "POST", { message });
    console.log("Message sent!");
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

// ==========================
// UI Navigation Helpers
// ==========================

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";

  if (pageId === "doctor-dashboard") {
    loadAppointments();
  } else if (pageId === "patient-dashboard") {
    loadDoctors();
    loadAppointments();
  }
}

// Auto-show login on load
document.addEventListener("DOMContentLoaded", () => {
  if (token && currentUser) {
    showPage(currentUser.role === "doctor" ? "doctor-dashboard" : "patient-dashboard");
  } else {
    showPage("login");
  }
});

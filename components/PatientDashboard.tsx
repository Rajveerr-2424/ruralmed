'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthWrapper'
import axios from 'axios'
import { toast } from 'react-toastify'

interface Appointment {
  _id: string
  doctorId: { name: string; specialization: string }
  appointmentDate: string
  appointmentTime: string
  status: string
  purpose: string
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments')
      if (response.data.success) {
        setAppointments(response.data.appointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with a doctor',
      icon: '📅',
      action: () => setActiveTab('book-appointment')
    },
    {
      title: 'Symptom Checker',
      description: 'AI-powered symptom analysis',
      icon: '🔍',
      action: () => setActiveTab('symptom-checker')
    },
    {
      title: 'Health Chat',
      description: 'Chat with AI health assistant',
      icon: '💬',
      action: () => setActiveTab('health-chat')
    },
    {
      title: 'Medical Records',
      description: 'View your medical history',
      icon: '📋',
      action: () => setActiveTab('medical-records')
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'book-appointment', label: 'Book Appointment' },
            { id: 'symptom-checker', label: 'Symptom Checker' },
            { id: 'health-chat', label: 'Health Chat' },
            { id: 'medical-records', label: 'Medical Records' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">
              Manage your health appointments and access medical services from anywhere.
            </p>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="card hover:shadow-md transition-shadow cursor-pointer text-left"
                >
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h4 className="font-medium text-gray-900 mb-2">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
            <div className="card">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No upcoming appointments. Book your first consultation!
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {appointment.doctorId.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.doctorId.specialization}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                        </p>
                      </div>
                      <span className={`status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'book-appointment' && <BookAppointmentForm />}
      {activeTab === 'symptom-checker' && <SymptomChecker />}
      {activeTab === 'health-chat' && <HealthChat />}
      {activeTab === 'medical-records' && <MedicalRecords />}
    </div>
  )
}

// Placeholder components for other tabs
function BookAppointmentForm() {
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Book New Appointment</h3>
      <p className="text-gray-600">Appointment booking functionality coming soon...</p>
    </div>
  )
}

function SymptomChecker() {
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">AI Symptom Checker</h3>
      <p className="text-gray-600">Symptom checker functionality coming soon...</p>
    </div>
  )
}

function HealthChat() {
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Health Assistant Chat</h3>
      <p className="text-gray-600">Health chat functionality coming soon...</p>
    </div>
  )
}

function MedicalRecords() {
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Records</h3>
      <p className="text-gray-600">Medical records functionality coming soon...</p>
    </div>
  )
}

'use client'

import { useAuth } from '@/components/AuthWrapper'
import PatientDashboard from '@/components/PatientDashboard'
import DoctorDashboard from '@/components/DoctorDashboard'
import AdminDashboard from '@/components/AdminDashboard'

export default function Dashboard() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Rural Healthcare System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="btn btn-outline text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {user.role === 'patient' && <PatientDashboard />}
        {user.role === 'doctor' && <DoctorDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
      </main>
    </div>
  )
}

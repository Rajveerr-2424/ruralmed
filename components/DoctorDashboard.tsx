'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthWrapper'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'patients', label: 'Patients' },
            { id: 'schedule', label: 'Schedule' }
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
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, Dr. {user?.name}!
            </h2>
            <p className="text-gray-600">
              Manage your patients and appointments efficiently.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card bg-blue-50">
              <h3 className="text-lg font-medium text-blue-900">Today's Appointments</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
            </div>
            <div className="card bg-green-50">
              <h3 className="text-lg font-medium text-green-900">Total Patients</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">28</p>
            </div>
            <div className="card bg-purple-50">
              <h3 className="text-lg font-medium text-purple-900">Pending Reviews</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">3</p>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {activeTab !== 'overview' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <p className="text-gray-600">This section is under development...</p>
        </div>
      )}
    </div>
  )
}

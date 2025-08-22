import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    let appointments = []
    if (user.role === 'patient') {
      appointments = await Appointment.find({ patientId: user.userId })
        .populate('doctorId', 'name specialization')
        .sort({ appointmentDate: 1 })
    } else if (user.role === 'doctor') {
      appointments = await Appointment.find({ doctorId: user.userId })
        .populate('patientId', 'name phone')
        .sort({ appointmentDate: 1 })
    } else if (user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('patientId', 'name phone')
        .populate('doctorId', 'name specialization')
        .sort({ appointmentDate: -1 })
    }

    return NextResponse.json({ success: true, appointments })

  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { doctorId, date, time, purpose, notes } = await request.json()

    await connectDB()

    const appointment = new Appointment({
      patientId: user.userId,
      doctorId,
      appointmentDate: date,
      appointmentTime: time,
      status: 'pending',
      purpose,
      notes,
      createdAt: new Date()
    })

    await appointment.save()

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    })

  } catch (error) {
    console.error('Book appointment error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to book appointment' },
      { status: 500 }
    )
  }
}

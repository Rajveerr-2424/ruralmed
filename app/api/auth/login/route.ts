import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    // Demo accounts for testing
    const demoAccounts = [
      { email: 'patient@demo.com', password: 'password123', role: 'patient', name: 'Priya Sharma' },
      { email: 'doctor@demo.com', password: 'password123', role: 'doctor', name: 'Dr. Anjali Verma' },
      { email: 'admin@demo.com', password: 'password123', role: 'admin', name: 'System Admin' }
    ]

    // Check demo accounts first
    const demoUser = demoAccounts.find(user => user.email === email && user.password === password)
    if (demoUser) {
      const token = jwt.sign(
        { userId: demoUser.email, email: demoUser.email, role: demoUser.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      )

      return NextResponse.json({
        success: true,
        user: {
          id: demoUser.email,
          email: demoUser.email,
          role: demoUser.role,
          name: demoUser.name
        },
        token
      })
    }

    // Check database for real users
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

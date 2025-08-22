import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const symptomDatabase = {
  conditions: [
    {
      symptoms: ['fever', 'headache', 'fatigue'],
      condition: 'Common Cold',
      severity: 'Low',
      recommendation: 'Rest, stay hydrated, and take over-the-counter medication. Consult a doctor if symptoms worsen or persist for more than a week.',
      duration: '7-10 days'
    },
    {
      symptoms: ['fever', 'cough', 'fatigue', 'muscle_aches'],
      condition: 'Influenza (Flu)',
      severity: 'Medium',
      recommendation: 'Rest, fluids, and antiviral medication if prescribed. Seek medical attention if you have difficulty breathing or high fever.',
      duration: '7-14 days'
    },
    {
      symptoms: ['chest_pain', 'shortness_of_breath', 'cough'],
      condition: 'Respiratory Infection',
      severity: 'High',
      recommendation: 'Seek immediate medical attention. This could indicate a serious condition requiring professional treatment.',
      duration: 'Varies'
    },
    {
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain'],
      condition: 'Gastroenteritis',
      severity: 'Medium',
      recommendation: 'Stay hydrated with clear fluids. Avoid solid foods initially. Seek medical care if symptoms are severe or persist.',
      duration: '2-5 days'
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { symptoms } = await request.json()

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { success: false, message: 'Invalid symptoms data' },
        { status: 400 }
      )
    }

    // Find matching conditions
    const matches = symptomDatabase.conditions.filter(condition => {
      const matchCount = condition.symptoms.filter(symptom => 
        symptoms.includes(symptom)
      ).length

      const matchPercentage = (matchCount / condition.symptoms.length) * 100
      return matchPercentage >= 40 // 40% match threshold
    })

    // Sort by relevance
    const sortedMatches = matches.map(condition => {
      const matchCount = condition.symptoms.filter(symptom => 
        symptoms.includes(symptom)
      ).length

      return {
        ...condition,
        matchPercentage: (matchCount / condition.symptoms.length) * 100,
        confidence: Math.min(matchCount * 20, 95)
      }
    }).sort((a, b) => b.matchPercentage - a.matchPercentage)

    const analysis = {
      possibleConditions: sortedMatches.slice(0, 3),
      severity: sortedMatches.length > 0 ? sortedMatches[0].severity : 'Unknown',
      generalRecommendation: 'Please consult with a healthcare professional for proper diagnosis and treatment.',
      urgency: determineUrgency(symptoms),
      disclaimer: 'This is an AI-generated assessment and should not replace professional medical advice.'
    }

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('Symptom analysis error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to analyze symptoms' },
      { status: 500 }
    )
  }
}

function determineUrgency(symptoms: string[]): string {
  const emergencySymptoms = ['chest_pain', 'shortness_of_breath', 'severe_headache', 'difficulty_breathing']
  const urgentSymptoms = ['high_fever', 'severe_pain', 'persistent_vomiting', 'severe_dizziness']

  if (symptoms.some(symptom => emergencySymptoms.includes(symptom))) {
    return 'Emergency - Seek immediate medical attention'
  }

  if (symptoms.some(symptom => urgentSymptoms.includes(symptom))) {
    return 'Urgent - Consult doctor within 24 hours'
  }

  return 'Non-urgent - Monitor symptoms and consult doctor if they worsen'
}

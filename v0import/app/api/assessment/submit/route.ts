import { type NextRequest, NextResponse } from "next/server"

interface AssessmentData {
  email: string
  companyName: string
  answers: Record<string, string>
  score: number
  completedAt: string
}

// In-memory storage (replace with database in production)
const assessments: Map<string, AssessmentData> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, companyName, answers, score } = body

    // Validate required fields
    if (!email || !companyName || !answers || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create assessment record
    const assessmentId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const assessmentData: AssessmentData = {
      email,
      companyName,
      answers,
      score,
      completedAt: new Date().toISOString(),
    }

    // Store assessment (in production, save to database)
    assessments.set(assessmentId, assessmentData)

    // Log for debugging
    console.log(`[v0] Assessment submitted for ${companyName} (${email}) with score ${score}%`)

    return NextResponse.json({
      success: true,
      assessmentId,
      message: "Assessment submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Error submitting assessment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 })
    }

    // Find assessments for this email
    const userAssessments = Array.from(assessments.entries())
      .filter(([_, data]) => data.email === email)
      .map(([id, data]) => ({ id, ...data }))

    return NextResponse.json({
      success: true,
      assessments: userAssessments,
    })
  } catch (error) {
    console.error("[v0] Error retrieving assessments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

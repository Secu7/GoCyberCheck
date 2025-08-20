import { type NextRequest, NextResponse } from "next/server"

// This would typically connect to your database
// For now, we'll use the same in-memory storage reference
const assessments: Map<string, any> = new Map()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const assessmentId = params.id

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    const assessment = assessments.get(assessmentId)

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      assessment: {
        id: assessmentId,
        ...assessment,
      },
    })
  } catch (error) {
    console.error("[v0] Error retrieving assessment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

interface AssessmentData {
  email: string
  companyName: string
  answers: Record<string, string>
  score: number
  completedAt: string
}

interface CategoryResult {
  title: string
  score: number
  maxScore: number
  percentage: number
  recommendations: string[]
}

const assessmentCategories = [
  {
    id: "policy",
    title: "Security Policies & Governance",
    questions: [
      { id: "policy_1", question: "Do you have a documented cybersecurity policy?", weight: 10 },
      { id: "policy_2", question: "How often is your security policy reviewed and updated?", weight: 8 },
      { id: "policy_3", question: "Do you have an incident response plan?", weight: 9 },
    ],
  },
  {
    id: "access",
    title: "Access Control & Authentication",
    questions: [
      { id: "access_1", question: "Do you use multi-factor authentication (MFA)?", weight: 10 },
      { id: "access_2", question: "How do you manage user access permissions?", weight: 8 },
      { id: "access_3", question: "Do you regularly review and audit user access?", weight: 7 },
    ],
  },
  {
    id: "data",
    title: "Data Protection & Encryption",
    questions: [
      { id: "data_1", question: "Are employee devices encrypted?", weight: 9 },
      { id: "data_2", question: "How do you backup critical data?", weight: 8 },
      { id: "data_3", question: "Do you have a data classification system?", weight: 6 },
    ],
  },
  {
    id: "network",
    title: "Network Security",
    questions: [
      { id: "network_1", question: "Do you use a firewall?", weight: 8 },
      { id: "network_2", question: "Do you monitor network traffic for threats?", weight: 7 },
      { id: "network_3", question: "How do you secure remote access?", weight: 9 },
    ],
  },
  {
    id: "training",
    title: "Security Awareness & Training",
    questions: [
      { id: "training_1", question: "Do you provide regular security training?", weight: 7 },
      { id: "training_2", question: "Do you conduct phishing simulation tests?", weight: 6 },
      { id: "training_3", question: "How do employees report security incidents?", weight: 5 },
    ],
  },
]

const getRecommendations = (categoryId: string, percentage: number): string[] => {
  const recommendations: Record<string, string[]> = {
    policy: [
      "Develop a comprehensive cybersecurity policy document",
      "Establish regular policy review cycles (annually recommended)",
      "Create and test an incident response plan",
      "Implement security governance framework",
      "Define roles and responsibilities for security",
    ],
    access: [
      "Implement multi-factor authentication for all users",
      "Deploy role-based access control (RBAC) system",
      "Conduct quarterly access reviews and audits",
      "Implement privileged access management (PAM)",
      "Establish user provisioning and deprovisioning procedures",
    ],
    data: [
      "Encrypt all employee devices and storage systems",
      "Implement automated encrypted backup solutions",
      "Develop data classification and handling procedures",
      "Deploy data loss prevention (DLP) tools",
      "Establish data retention and disposal policies",
    ],
    network: [
      "Deploy next-generation firewall with monitoring",
      "Implement 24/7 network traffic monitoring",
      "Secure remote access with VPN and MFA",
      "Conduct regular network security assessments",
      "Implement network segmentation and zero trust",
    ],
    training: [
      "Establish regular security awareness training program",
      "Conduct monthly phishing simulation exercises",
      "Create dedicated security incident reporting system",
      "Develop security culture and communication plan",
      "Provide role-specific security training",
    ],
  }

  const categoryRecs = recommendations[categoryId] || []

  if (percentage >= 80) return categoryRecs.slice(0, 2)
  if (percentage >= 60) return categoryRecs.slice(0, 3)
  if (percentage >= 40) return categoryRecs.slice(0, 4)
  return categoryRecs
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assessmentData }: { assessmentData: AssessmentData } = body

    if (!assessmentData) {
      return NextResponse.json({ error: "Assessment data required" }, { status: 400 })
    }

    // Calculate category scores
    const categoryResults: CategoryResult[] = assessmentCategories.map((category) => {
      let categoryScore = 0
      let maxCategoryScore = 0

      category.questions.forEach((question) => {
        maxCategoryScore += question.weight * 4
        const answer = assessmentData.answers[question.id]
        if (answer) {
          // Simulate scoring based on answer quality (this would be more sophisticated in production)
          const scoreMultiplier =
            answer.includes("Yes, comprehensive") || answer.includes("24/7") || answer.includes("Monthly")
              ? 4
              : answer.includes("Yes") || answer.includes("Quarterly")
                ? 3
                : answer.includes("Partially") || answer.includes("Annual")
                  ? 2
                  : 1
          categoryScore += question.weight * scoreMultiplier
        }
      })

      const percentage = Math.round((categoryScore / maxCategoryScore) * 100)

      return {
        title: category.title,
        score: categoryScore,
        maxScore: maxCategoryScore,
        percentage,
        recommendations: getRecommendations(category.id, percentage),
      }
    })

    // Generate comprehensive PDF report data
    const reportData = {
      companyName: assessmentData.companyName,
      email: assessmentData.email,
      overallScore: assessmentData.score,
      completedAt: new Date(assessmentData.completedAt).toLocaleDateString(),
      categoryResults,
      executiveSummary: generateExecutiveSummary(assessmentData.score, categoryResults),
      priorityActions: generatePriorityActions(categoryResults),
      complianceMapping: generateComplianceMapping(assessmentData.score),
    }

    // In production, you would use a PDF generation library like Puppeteer or jsPDF
    // For now, we'll return the structured data that can be used to generate a PDF
    console.log(`[v0] Generated PDF report data for ${assessmentData.companyName}`)

    return NextResponse.json({
      success: true,
      reportData,
      message: "PDF report data generated successfully",
    })
  } catch (error) {
    console.error("[v0] Error generating PDF report:", error)
    return NextResponse.json({ error: "Failed to generate PDF report" }, { status: 500 })
  }
}

function generateExecutiveSummary(overallScore: number, categoryResults: CategoryResult[]): string {
  const scoreLevel =
    overallScore >= 80
      ? "excellent"
      : overallScore >= 60
        ? "good"
        : overallScore >= 40
          ? "fair"
          : "needs significant improvement"

  const strongestCategory = categoryResults.reduce((prev, current) =>
    prev.percentage > current.percentage ? prev : current,
  )

  const weakestCategory = categoryResults.reduce((prev, current) =>
    prev.percentage < current.percentage ? prev : current,
  )

  return `Your organization's cybersecurity posture is ${scoreLevel} with an overall score of ${overallScore}%. 
    Your strongest area is ${strongestCategory.title} (${strongestCategory.percentage}%), while ${weakestCategory.title} 
    (${weakestCategory.percentage}%) requires the most attention. This assessment evaluated ${categoryResults.length} 
    key security domains and provides actionable recommendations to enhance your security posture.`
}

function generatePriorityActions(categoryResults: CategoryResult[]): string[] {
  return categoryResults
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)
    .flatMap((category) => category.recommendations.slice(0, 2))
}

function generateComplianceMapping(score: number): Record<string, string> {
  return {
    "ISO 27001": score >= 70 ? "Likely Compliant" : "Gaps Identified",
    "NIST Framework": score >= 65 ? "Likely Compliant" : "Gaps Identified",
    "SOC 2": score >= 75 ? "Likely Compliant" : "Gaps Identified",
    GDPR: score >= 60 ? "Likely Compliant" : "Gaps Identified",
  }
}

import { type NextRequest, NextResponse } from "next/server"

interface EmailData {
  to: string
  companyName: string
  score: number
  assessmentId: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, companyName, score, assessmentId }: EmailData = body

    // Validate required fields
    if (!to || !companyName || score === undefined || !assessmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, integrate with email service (SendGrid, Resend, etc.)
    // For now, we'll simulate sending an email
    console.log(`[v0] Sending assessment report email to ${to}`)
    console.log(`[v0] Company: ${companyName}`)
    console.log(`[v0] Score: ${score}%`)
    console.log(`[v0] Assessment ID: ${assessmentId}`)

    // Simulate email content
    const emailContent = {
      subject: `Your Cybersecurity Assessment Report - ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #6366f1; color: white; padding: 20px; text-align: center;">
            <h1>🛡️ GoCyberCheck Assessment Report</h1>
          </div>
          
          <div style="padding: 20px; background: #f8fafc;">
            <h2>Hello ${companyName},</h2>
            <p>Thank you for completing your cybersecurity assessment. Here are your results:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Security Score: ${score}%</h3>
              <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: ${score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444"}; height: 100%; width: ${score}%; transition: width 0.3s ease;"></div>
              </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Next Steps:</h3>
              <ul>
                <li>Review your detailed assessment report</li>
                <li>Implement priority security recommendations</li>
                <li>Schedule a consultation with our experts</li>
                <li>Set up regular security assessments</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/assessment/report/${assessmentId}" 
                 style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Full Report
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This assessment was completed on ${new Date().toLocaleDateString()}. 
              If you have any questions, please contact our support team.
            </p>
          </div>
          
          <div style="background: #374151; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>&copy; 2024 GoCyberCheck. All rights reserved.</p>
          </div>
        </div>
      `,
    }

    // In production, send actual email here
    // await emailService.send(emailContent)

    // Simulate successful email sending
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Assessment report sent successfully",
      emailPreview: emailContent, // Remove in production
    })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

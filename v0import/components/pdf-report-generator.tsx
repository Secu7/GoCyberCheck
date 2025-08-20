"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"

interface PDFReportGeneratorProps {
  assessmentData: {
    email: string
    companyName: string
    answers: Record<string, string>
    score: number
    completedAt: string
  }
}

export function PDFReportGenerator({ assessmentData }: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/assessment/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assessmentData }),
      })

      const result = await response.json()

      if (result.success) {
        // Create a comprehensive HTML report that can be printed as PDF
        const reportHTML = generateReportHTML(result.reportData)

        // Open in new window for printing/saving as PDF
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(reportHTML)
          printWindow.document.close()

          // Trigger print dialog after content loads
          printWindow.onload = () => {
            printWindow.print()
          }
        }
      } else {
        console.error("[v0] PDF generation failed:", result.error)
        alert("Failed to generate PDF report. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("An error occurred while generating the PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateReportHTML = (reportData: any) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cybersecurity Assessment Report - ${reportData.companyName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          color: #374151;
          background: white;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #6366f1; 
          padding-bottom: 30px; 
          margin-bottom: 40px; 
        }
        .logo { 
          font-size: 32px; 
          font-weight: bold; 
          color: #6366f1; 
          margin-bottom: 10px; 
        }
        .company-name { 
          font-size: 24px; 
          color: #1f2937; 
          margin-bottom: 10px; 
        }
        .date { color: #6b7280; font-size: 14px; }
        .score-section { 
          background: #f8fafc; 
          padding: 30px; 
          border-radius: 12px; 
          text-align: center; 
          margin-bottom: 40px; 
        }
        .score-circle { 
          width: 120px; 
          height: 120px; 
          border-radius: 50%; 
          background: conic-gradient(#6366f1 ${reportData.overallScore * 3.6}deg, #e5e7eb 0deg);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 auto 20px; 
          position: relative;
        }
        .score-inner { 
          width: 90px; 
          height: 90px; 
          background: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 24px; 
          font-weight: bold; 
          color: #1f2937; 
        }
        .score-label { 
          font-size: 18px; 
          color: #6366f1; 
          font-weight: bold; 
        }
        .section { margin-bottom: 40px; }
        .section-title { 
          font-size: 20px; 
          font-weight: bold; 
          color: #1f2937; 
          margin-bottom: 20px; 
          border-left: 4px solid #6366f1; 
          padding-left: 15px; 
        }
        .category { 
          background: white; 
          border: 1px solid #e5e7eb; 
          border-radius: 8px; 
          padding: 20px; 
          margin-bottom: 20px; 
        }
        .category-header { 
          display: flex; 
          justify-content: between; 
          align-items: center; 
          margin-bottom: 15px; 
        }
        .category-title { 
          font-size: 16px; 
          font-weight: bold; 
          color: #1f2937; 
        }
        .category-score { 
          font-size: 14px; 
          font-weight: bold; 
          color: #6366f1; 
        }
        .progress-bar { 
          width: 100%; 
          height: 8px; 
          background: #e5e7eb; 
          border-radius: 4px; 
          overflow: hidden; 
          margin-bottom: 15px; 
        }
        .progress-fill { 
          height: 100%; 
          background: #6366f1; 
          transition: width 0.3s ease; 
        }
        .recommendations { 
          list-style: none; 
          padding: 0; 
        }
        .recommendations li { 
          padding: 8px 0; 
          border-bottom: 1px solid #f3f4f6; 
          color: #4b5563; 
          font-size: 14px; 
        }
        .recommendations li:before { 
          content: "→ "; 
          color: #6366f1; 
          font-weight: bold; 
        }
        .executive-summary { 
          background: #f0f9ff; 
          border-left: 4px solid #0ea5e9; 
          padding: 20px; 
          border-radius: 0 8px 8px 0; 
          margin-bottom: 30px; 
        }
        .priority-actions { 
          background: #fef3c7; 
          border-left: 4px solid #f59e0b; 
          padding: 20px; 
          border-radius: 0 8px 8px 0; 
        }
        .compliance-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 15px; 
        }
        .compliance-item { 
          padding: 15px; 
          background: #f8fafc; 
          border-radius: 8px; 
          text-align: center; 
        }
        .compliance-name { 
          font-weight: bold; 
          color: #1f2937; 
          margin-bottom: 5px; 
        }
        .compliance-status { 
          font-size: 12px; 
          padding: 4px 8px; 
          border-radius: 12px; 
          color: white; 
        }
        .compliant { background: #10b981; }
        .gaps { background: #ef4444; }
        .footer { 
          text-align: center; 
          padding-top: 30px; 
          border-top: 1px solid #e5e7eb; 
          color: #6b7280; 
          font-size: 12px; 
        }
        @media print {
          body { print-color-adjust: exact; }
          .container { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛡️ GoCyberCheck</div>
          <div class="company-name">${reportData.companyName}</div>
          <div class="date">Cybersecurity Assessment Report • ${reportData.completedAt}</div>
        </div>

        <div class="score-section">
          <div class="score-circle">
            <div class="score-inner">${reportData.overallScore}%</div>
          </div>
          <div class="score-label">Overall Security Score</div>
        </div>

        <div class="section">
          <div class="section-title">Executive Summary</div>
          <div class="executive-summary">
            ${reportData.executiveSummary}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Category Assessment</div>
          ${reportData.categoryResults
            .map(
              (category: any) => `
            <div class="category">
              <div class="category-header">
                <div class="category-title">${category.title}</div>
                <div class="category-score">${category.percentage}%</div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${category.percentage}%"></div>
              </div>
              <div class="section-title" style="font-size: 14px; margin-bottom: 10px;">Recommendations:</div>
              <ul class="recommendations">
                ${category.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
              </ul>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="section">
          <div class="section-title">Priority Actions</div>
          <div class="priority-actions">
            <ul class="recommendations">
              ${reportData.priorityActions.map((action: string) => `<li>${action}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Compliance Mapping</div>
          <div class="compliance-grid">
            ${Object.entries(reportData.complianceMapping)
              .map(
                ([framework, status]: [string, any]) => `
              <div class="compliance-item">
                <div class="compliance-name">${framework}</div>
                <div class="compliance-status ${status.includes("Likely") ? "compliant" : "gaps"}">${status}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="footer">
          <p>This report was generated by GoCyberCheck on ${new Date().toLocaleDateString()}</p>
          <p>For questions or support, contact: support@gocybercheck.com</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  return (
    <Button size="lg" className="bg-secondary hover:bg-secondary/90" onClick={generatePDF} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-2" />
          Download PDF Report
        </>
      )}
    </Button>
  )
}

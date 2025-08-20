"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, ChevronLeft, ChevronRight, Mail, FileText, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  type: "radio" | "checkbox" | "text"
  options?: string[]
  required: boolean
  weight: number
}

interface Category {
  id: string
  title: string
  description: string
  questions: Question[]
}

const assessmentData: Category[] = [
  {
    id: "policy",
    title: "Security Policy & Governance",
    description: "Evaluate your organization's security policies and governance framework",
    questions: [
      {
        id: "policy_1",
        question: "Do you have documented cybersecurity policies?",
        type: "radio",
        options: ["Yes, comprehensive policies", "Yes, basic policies", "In development", "No policies"],
        required: true,
        weight: 10,
      },
      {
        id: "policy_2",
        question: "How often do you review and update security policies?",
        type: "radio",
        options: ["Annually", "Every 2 years", "As needed", "Never updated"],
        required: true,
        weight: 8,
      },
      {
        id: "policy_3",
        question: "Do you have an incident response plan?",
        type: "radio",
        options: ["Yes, regularly tested", "Yes, but not tested", "In development", "No plan"],
        required: true,
        weight: 9,
      },
    ],
  },
  {
    id: "access",
    title: "Access Control & Authentication",
    description: "Assess your user access management and authentication systems",
    questions: [
      {
        id: "access_1",
        question: "Do you use multi-factor authentication (MFA)?",
        type: "radio",
        options: ["Yes, for all users", "Yes, for admins only", "Partially implemented", "No MFA"],
        required: true,
        weight: 10,
      },
      {
        id: "access_2",
        question: "How do you manage user access permissions?",
        type: "radio",
        options: ["Role-based access control", "Manual assignment", "Default permissions", "No formal process"],
        required: true,
        weight: 8,
      },
      {
        id: "access_3",
        question: "Do you regularly review and audit user access permissions?",
        type: "radio",
        options: ["Monthly", "Quarterly", "Annually", "Never"],
        required: true,
        weight: 7,
      },
    ],
  },
  {
    id: "data",
    title: "Data Protection & Encryption",
    description: "Review your data protection measures and encryption practices",
    questions: [
      {
        id: "data_1",
        question: "Are employee devices encrypted?",
        type: "radio",
        options: ["All devices encrypted", "Partially encrypted", "Encryption planned", "No encryption"],
        required: true,
        weight: 9,
      },
      {
        id: "data_2",
        question: "How do you backup critical data?",
        type: "radio",
        options: [
          "Automated encrypted backups",
          "Manual encrypted backups",
          "Unencrypted backups",
          "No regular backups",
        ],
        required: true,
        weight: 8,
      },
      {
        id: "data_3",
        question: "Do you have a data classification system?",
        type: "radio",
        options: ["Yes, fully implemented", "Partially implemented", "In development", "No classification"],
        required: true,
        weight: 6,
      },
    ],
  },
  {
    id: "network",
    title: "Network Security",
    description: "Evaluate your network security infrastructure and monitoring",
    questions: [
      {
        id: "network_1",
        question: "Do you use firewalls?",
        type: "radio",
        options: ["Next-gen firewall + monitoring", "Basic firewall", "Software firewall only", "No firewall"],
        required: true,
        weight: 8,
      },
      {
        id: "network_2",
        question: "Do you monitor network traffic for threats?",
        type: "radio",
        options: ["24/7 monitoring + alerts", "Regular monitoring", "Occasional monitoring", "No monitoring"],
        required: true,
        weight: 7,
      },
      {
        id: "network_3",
        question: "How do you secure remote access?",
        type: "radio",
        options: ["VPN + MFA", "VPN only", "Direct access with password", "No remote access controls"],
        required: true,
        weight: 9,
      },
    ],
  },
  {
    id: "training",
    title: "Security Awareness & Training",
    description: "Assess your employee security training and awareness programs",
    questions: [
      {
        id: "training_1",
        question: "Do you provide regular security training?",
        type: "radio",
        options: ["Monthly training", "Quarterly training", "Annual training", "No formal training"],
        required: true,
        weight: 7,
      },
      {
        id: "training_2",
        question: "Do you conduct phishing simulation tests?",
        type: "radio",
        options: ["Monthly simulations", "Quarterly simulations", "Annual simulations", "No simulations"],
        required: true,
        weight: 6,
      },
      {
        id: "training_3",
        question: "How do employees report security incidents?",
        type: "radio",
        options: ["Dedicated reporting system", "IT team email", "Informal reporting", "No reporting process"],
        required: true,
        weight: 5,
      },
    ],
  },
]

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessmentId, setAssessmentId] = useState("")

  const totalQuestions = assessmentData.reduce((total, category) => total + category.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const progress = (answeredQuestions / totalQuestions) * 100

  useEffect(() => {
    const savedAnswers = localStorage.getItem("cybercheck-answers")
    const savedEmail = localStorage.getItem("cybercheck-email")
    const savedCompany = localStorage.getItem("cybercheck-company")

    if (savedAnswers) setAnswers(JSON.parse(savedAnswers))
    if (savedEmail) setEmail(savedEmail)
    if (savedCompany) setCompanyName(savedCompany)
  }, [])

  useEffect(() => {
    localStorage.setItem("cybercheck-answers", JSON.stringify(answers))
    if (email) localStorage.setItem("cybercheck-email", email)
    if (companyName) localStorage.setItem("cybercheck-company", companyName)
  }, [answers, email, companyName])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateScore = () => {
    let totalScore = 0
    let maxScore = 0

    assessmentData.forEach((category) => {
      category.questions.forEach((question) => {
        maxScore += question.weight * 4 // Assuming 4 is max score per question
        const answer = answers[question.id]
        if (answer) {
          const optionIndex = question.options?.indexOf(answer) ?? 0
          const score = question.weight * (4 - optionIndex) // Higher score for better options
          totalScore += score
        }
      })
    })

    return Math.round((totalScore / maxScore) * 100)
  }

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" }
    if (score >= 60) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" }
    if (score >= 40) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-100" }
  }

  const handleSubmit = () => {
    if (answeredQuestions === totalQuestions) {
      setShowEmailForm(true)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && companyName && !isSubmitting) {
      setIsSubmitting(true)

      try {
        const score = calculateScore()

        const response = await fetch("/api/assessment/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            companyName,
            answers,
            score,
          }),
        })

        const result = await response.json()

        if (result.success) {
          setAssessmentId(result.assessmentId)

          await fetch("/api/email/send-report", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: email,
              companyName,
              score,
              assessmentId: result.assessmentId,
            }),
          })

          setShowResults(true)
          setShowEmailForm(false)
        } else {
          console.error("[v0] Assessment submission failed:", result.error)
          alert("Failed to submit assessment. Please try again.")
        }
      } catch (error) {
        console.error("[v0] Error submitting assessment:", error)
        alert("An error occurred. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const currentCategory = assessmentData[currentStep]
  const isLastStep = currentStep === assessmentData.length - 1

  if (showResults) {
    const score = calculateScore()
    const scoreInfo = getScoreLevel(score)

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-primary">GoCyberCheck</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Assessment Complete!</h1>
            <p className="text-xl text-muted-foreground">Your cybersecurity assessment report</p>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${scoreInfo.bg} ${scoreInfo.color} font-semibold mb-4`}
              >
                <Shield className="h-5 w-5" />
                {scoreInfo.level}
              </div>
              <CardTitle className="text-3xl">Security Score: {score}%</CardTitle>
              <CardDescription>Based on {totalQuestions} security checkpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={score} className="h-3 mb-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Assessment Summary</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Questions answered:</span>
                      <span className="font-medium">
                        {answeredQuestions}/{totalQuestions}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Company:</span>
                      <span className="font-medium">{companyName}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Assessment date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString("en-US")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Next Steps</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 text-accent" />
                      Download detailed PDF report
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-accent" />
                      Review priority recommendations
                    </li>
                    <li className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-accent" />
                      Schedule expert consultation
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-primary">GoCyberCheck</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
              <CardTitle>Get Your Security Report</CardTitle>
              <CardDescription>
                Enter your information to receive your personalized cybersecurity assessment report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEmailForm(false)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Back to Assessment
                  </Button>
                  <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Get Report"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold text-primary">GoCyberCheck</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Cybersecurity Assessment</h1>
            <Badge variant="outline">
              Step {currentStep + 1} of {assessmentData.length}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Progress: {answeredQuestions}/{totalQuestions} questions
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              {currentCategory.title}
            </CardTitle>
            <CardDescription>{currentCategory.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentCategory.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium leading-relaxed">
                  {question.question}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {question.type === "radio" && question.options && (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                        <Label htmlFor={`${question.id}-${option}`} className="font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={answeredQuestions < totalQuestions}
              className="bg-accent hover:bg-accent/90"
            >
              Complete Assessment
              <FileText className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep(Math.min(assessmentData.length - 1, currentStep + 1))}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Sparkles, Brain, AlertCircle, CheckCircle2, ChevronRight, Lightbulb, Shield } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { VACCINATION_SCHEDULE } from "@/lib/types"
import { cn } from "@/lib/utils"

interface Insight {
  id: string
  type: "warning" | "success" | "tip" | "recommendation"
  title: string
  description: string
  action?: { label: string; href: string }
}

export function AIInsightsCard() {
  const { children, getOverdueVaccinations, getUpcomingVaccinations, vaccinationRecords } = useData()
  const [insights, setInsights] = useState<Insight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      const generatedInsights: Insight[] = []
      const overdue = getOverdueVaccinations()
      const upcoming = getUpcomingVaccinations()
      const completedCount = vaccinationRecords.filter((r) => r.status === "completed").length
      
      // Overdue warning
      if (overdue.length > 0) {
        const child = overdue[0].child
        const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === overdue[0].vaccineId)
        generatedInsights.push({
          id: "overdue",
          type: "warning",
          title: `${child.name} has overdue vaccination`,
          description: `${vaccine?.name || "A vaccine"} was scheduled and is now overdue. Schedule an appointment soon.`,
          action: { label: "View Schedule", href: "/schedule" },
        })
      }

      // Upcoming reminder
      if (upcoming.length > 0) {
        const nextUp = upcoming[0]
        const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === nextUp.vaccineId)
        const daysUntil = Math.ceil((new Date(nextUp.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        
        if (daysUntil <= 7) {
          generatedInsights.push({
            id: "upcoming-soon",
            type: "tip",
            title: `Upcoming vaccination in ${daysUntil} days`,
            description: `${nextUp.child.name} is due for ${vaccine?.name || "a vaccine"}. Consider booking an appointment.`,
            action: { label: "Find Clinic", href: "/clinics" },
          })
        }
      }

      // Success message for good progress
      if (completedCount > 0 && overdue.length === 0) {
        generatedInsights.push({
          id: "good-progress",
          type: "success",
          title: "Great vaccination progress!",
          description: `You've completed ${completedCount} vaccinations. Keep up the excellent work protecting your children.`,
        })
      }

      // AI recommendation
      if (children.length > 0) {
        generatedInsights.push({
          id: "ai-tip",
          type: "recommendation",
          title: "AI Recommendation",
          description: "Based on your children's ages, consider scheduling flu shots before the upcoming flu season.",
          action: { label: "Ask AI Assistant", href: "/assistant" },
        })
      }

      setInsights(generatedInsights.slice(0, 3))
      setIsAnalyzing(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [children, getOverdueVaccinations, getUpcomingVaccinations, vaccinationRecords])

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "warning": return AlertCircle
      case "success": return CheckCircle2
      case "tip": return Lightbulb
      case "recommendation": return Brain
    }
  }

  const getInsightStyles = (type: Insight["type"]) => {
    switch (type) {
      case "warning": return { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" }
      case "success": return { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20" }
      case "tip": return { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" }
      case "recommendation": return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" }
    }
  }

  return (
    <Card className="relative overflow-hidden border-primary/20">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">AI Health Insights</CardTitle>
              <p className="text-xs text-muted-foreground">Powered by VaxCare AI</p>
            </div>
          </div>
          <Link href="/assistant">
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              Chat with AI
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-3">
        {isAnalyzing ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ) : (
          insights.map((insight) => {
            const Icon = getInsightIcon(insight.type)
            const styles = getInsightStyles(insight.type)
            
            return (
              <div
                key={insight.id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-colors hover:bg-muted/30",
                  styles.border,
                  styles.bg
                )}
              >
                <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0", styles.bg)}>
                  <Icon className={cn("w-4 h-4", styles.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", styles.text)}>{insight.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{insight.description}</p>
                  {insight.action && (
                    <Link 
                      href={insight.action.href}
                      className={cn("inline-flex items-center gap-1 text-xs font-medium mt-2 hover:underline", styles.text)}
                    >
                      {insight.action.label}
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* Protection score */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Protection Score</p>
                <p className="text-xs text-muted-foreground">Based on vaccination completion</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {vaccinationRecords.length > 0 
                  ? Math.round((vaccinationRecords.filter(r => r.status === "completed").length / vaccinationRecords.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
              style={{ 
                width: `${vaccinationRecords.length > 0 
                  ? (vaccinationRecords.filter(r => r.status === "completed").length / vaccinationRecords.length) * 100
                  : 0}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/lib/data-context"
import { VACCINATION_SCHEDULE } from "@/lib/types"
import { cn } from "@/lib/utils"

export function VaccinationTimeline() {
  const { vaccinationRecords, children } = useData()

  // Get recent activity (last 5 vaccinations)
  const recentRecords = [...vaccinationRecords]
    .sort((a, b) => {
      const dateA = a.administeredDate || a.scheduledDate
      const dateB = b.administeredDate || b.scheduledDate
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
    .slice(0, 5)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle2
      case "scheduled": return Clock
      case "overdue": return AlertCircle
      default: return Calendar
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed": return { bg: "bg-emerald-500", line: "bg-emerald-500/30" }
      case "scheduled": return { bg: "bg-blue-500", line: "bg-blue-500/30" }
      case "overdue": return { bg: "bg-red-500", line: "bg-red-500/30" }
      default: return { bg: "bg-muted", line: "bg-muted" }
    }
  }

  if (recentRecords.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Vaccination Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {recentRecords.map((record, index) => {
            const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === record.vaccineId)
            const child = children.find((c) => c.id === record.childId)
            const Icon = getStatusIcon(record.status)
            const styles = getStatusStyles(record.status)
            const isLast = index === recentRecords.length - 1
            const displayDate = record.administeredDate || record.scheduledDate

            return (
              <div key={record.id} className="relative flex gap-4">
                {/* Timeline line */}
                {!isLast && (
                  <div className={cn(
                    "absolute left-[15px] top-8 w-0.5 h-full",
                    styles.line
                  )} />
                )}
                
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                  styles.bg
                )}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                
                {/* Content */}
                <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {vaccine?.name || "Unknown Vaccine"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {child?.name || "Unknown Child"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground">
                        {formatDate(displayDate)}
                      </p>
                      <p className={cn(
                        "text-[10px] font-medium uppercase tracking-wider mt-0.5",
                        record.status === "completed" && "text-emerald-600",
                        record.status === "scheduled" && "text-blue-600",
                        record.status === "overdue" && "text-red-600"
                      )}>
                        {record.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

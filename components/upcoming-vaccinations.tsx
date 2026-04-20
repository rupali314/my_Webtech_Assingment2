"use client"

import { Calendar, Clock, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { VACCINATION_SCHEDULE } from "@/lib/types"

export function UpcomingVaccinations() {
  const { getUpcomingVaccinations, getOverdueVaccinations } = useData()

  const upcoming = getUpcomingVaccinations().slice(0, 3)
  const overdue = getOverdueVaccinations()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntil = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(dateStr)
    date.setHours(0, 0, 0, 0)
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Upcoming Vaccinations</CardTitle>
        <Link href="/schedule">
          <Button variant="ghost" size="sm" className="text-primary">
            View all
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {overdue.length > 0 && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Overdue Vaccinations</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {overdue.length} vaccination(s) are past their scheduled date.
                </p>
                <Link href="/schedule" className="text-sm font-medium text-destructive hover:underline mt-2 inline-block">
                  Review now
                </Link>
              </div>
            </div>
          </div>
        )}

        {upcoming.length === 0 && overdue.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No upcoming vaccinations scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((record) => {
              const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === record.vaccineId)
              const daysUntil = getDaysUntil(record.scheduledDate)

              return (
                <div
                  key={record.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.child.avatarColor}`}>
                    {record.child.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {vaccine?.name || "Unknown Vaccine"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.child.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatDate(record.scheduledDate)}
                    </div>
                    <Badge
                      variant={daysUntil <= 7 ? "secondary" : "outline"}
                      className="mt-1"
                    >
                      {daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                          ? "Tomorrow"
                          : `In ${daysUntil} days`}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { VACCINATION_SCHEDULE } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ScheduleCalendar() {
  const { children, vaccinationRecords } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getVaccinationsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return vaccinationRecords.filter((r) => {
      const compareDate = r.administeredDate || r.scheduledDate
      return compareDate === dateStr
    })
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">{monthName}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2 min-h-24" />
            }

            const vaccinations = getVaccinationsForDay(day)
            const hasCompleted = vaccinations.some((v) => v.status === "completed")
            const hasUpcoming = vaccinations.some((v) => v.status === "upcoming")
            const hasOverdue = vaccinations.some((v) => v.status === "overdue")

            return (
              <div
                key={day}
                className={cn(
                  "p-2 min-h-24 border border-border rounded-lg transition-colors",
                  isToday(day) && "bg-primary/5 border-primary",
                  vaccinations.length > 0 && "hover:bg-muted/50 cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isToday(day) ? "text-primary" : "text-foreground"
                  )}
                >
                  {day}
                </div>
                {vaccinations.length > 0 && (
                  <div className="space-y-1">
                    {vaccinations.slice(0, 2).map((record) => {
                      const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === record.vaccineId)
                      const child = children.find((c) => c.id === record.childId)

                      return (
                        <div
                          key={record.id}
                          className={cn(
                            "text-xs p-1 rounded truncate",
                            record.status === "completed" && "bg-green-100 text-green-700",
                            record.status === "upcoming" && "bg-amber-100 text-amber-700",
                            record.status === "overdue" && "bg-red-100 text-red-700"
                          )}
                          title={`${child?.name}: ${vaccine?.name}`}
                        >
                          {child?.name.split(" ")[0]}
                        </div>
                      )
                    })}
                    {vaccinations.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{vaccinations.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-muted-foreground">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-muted-foreground">Overdue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

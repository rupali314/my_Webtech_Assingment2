"use client"

import Link from "next/link"
import { Plus, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useData } from "@/lib/data-context"
import { VACCINATION_SCHEDULE } from "@/lib/types"

export function ChildrenOverview() {
  const { children, getChildVaccinations } = useData()

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()

    if (years === 0) {
      return `${months + (today.getDate() < birth.getDate() ? -1 : 0)} months`
    }
    if (years === 1 && months < 0) {
      return `${12 + months} months`
    }
    return `${years} ${years === 1 ? "year" : "years"} old`
  }

  const getCompletionRate = (childId: string) => {
    const records = getChildVaccinations(childId)
    const completedCount = records.filter((r) => r.status === "completed").length
    const totalScheduled = VACCINATION_SCHEDULE.length
    return Math.round((completedCount / totalScheduled) * 100)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">My Children</CardTitle>
        <Link href="/children">
          <Button variant="ghost" size="sm" className="text-primary">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {children.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No children registered yet.</p>
            <Link href="/children">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </Button>
            </Link>
          </div>
        ) : (
          children.map((child) => {
            const completionRate = getCompletionRate(child.id)
            const records = getChildVaccinations(child.id)
            const completedCount = records.filter((r) => r.status === "completed").length

            return (
              <Link key={child.id} href={`/children/${child.id}`}>
                <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${child.avatarColor}`}
                    >
                      {child.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{child.name}</p>
                      <p className="text-sm text-muted-foreground">{calculateAge(child.dateOfBirth)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Vaccination Progress</span>
                      <span className="font-medium text-foreground">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {completedCount} of {VACCINATION_SCHEDULE.length} vaccines completed
                    </p>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

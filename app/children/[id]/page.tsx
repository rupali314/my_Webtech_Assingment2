"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle2, Clock, AlertTriangle, Edit2 } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DataProvider, useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { VACCINATION_SCHEDULE } from "@/lib/types"

function ChildDetailContent({ childId }: { childId: string }) {
  const { children, getChildVaccinations } = useData()
  const child = children.find((c) => c.id === childId)
  const vaccinations = getChildVaccinations(childId)

  if (!child) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Child not found</h2>
          <p className="text-muted-foreground mb-4">
            The requested child profile could not be found.
          </p>
          <Link href="/children">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Children
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()

    if (years === 0) {
      return `${months + (today.getDate() < birth.getDate() ? -1 : 0)} months old`
    }
    if (years === 1 && months < 0) {
      return `${12 + months} months old`
    }
    return `${years} ${years === 1 ? "year" : "years"} old`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const completedCount = vaccinations.filter((r) => r.status === "completed").length
  const upcomingCount = vaccinations.filter((r) => r.status === "upcoming").length
  const overdueCount = vaccinations.filter((r) => r.status === "overdue").length
  const completionRate = Math.round((completedCount / VACCINATION_SCHEDULE.length) * 100)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-100",
          badge: "bg-green-100 text-green-700",
        }
      case "upcoming":
        return {
          icon: Clock,
          color: "text-amber-600",
          bg: "bg-amber-100",
          badge: "bg-amber-100 text-amber-700",
        }
      case "overdue":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bg: "bg-red-100",
          badge: "bg-red-100 text-red-700",
        }
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bg: "bg-muted",
          badge: "bg-muted text-muted-foreground",
        }
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <Link
        href="/children"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Children
      </Link>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${child.avatarColor}`}
            >
              {child.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{child.name}</h2>
                  <p className="text-muted-foreground">{calculateAge(child.dateOfBirth)}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Born {formatDate(child.dateOfBirth)}
                    <span className="capitalize">({child.gender})</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{completionRate}%</div>
            <p className="text-sm text-muted-foreground">Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{upcomingCount}</div>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Vaccination Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionRate} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {completedCount} of {VACCINATION_SCHEDULE.length} recommended vaccinations completed
          </p>
        </CardContent>
      </Card>

      {/* Vaccination History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vaccination History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vaccinations
              .sort((a, b) => {
                const statusOrder = { overdue: 0, upcoming: 1, completed: 2 }
                return statusOrder[a.status] - statusOrder[b.status]
              })
              .map((record) => {
                const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === record.vaccineId)
                const statusConfig = getStatusConfig(record.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.bg}`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {vaccine?.name || "Unknown Vaccine"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {record.status === "completed" && record.administeredDate
                          ? `Administered: ${formatDate(record.administeredDate)}`
                          : `Scheduled: ${formatDate(record.scheduledDate)}`}
                      </p>
                      {record.administeredBy && (
                        <p className="text-xs text-muted-foreground mt-1">
                          By {record.administeredBy} at {record.location}
                        </p>
                      )}
                    </div>
                    <Badge className={statusConfig.badge} variant="secondary">
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default function ChildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-64">
          <AppHeader />
          <ChildDetailContent childId={id} />
        </div>
      </div>
    </DataProvider>
  )
}

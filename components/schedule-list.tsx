"use client"

import { useState } from "react"
import { CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/lib/data-context"
import { VACCINATION_SCHEDULE } from "@/lib/types"

export function ScheduleList() {
  const { children, vaccinationRecords, updateVaccinationRecord } = useData()
  const [expandedChild, setExpandedChild] = useState<string | null>(children[0]?.id || null)
  const [markingComplete, setMarkingComplete] = useState<string | null>(null)
  const [completeForm, setCompleteForm] = useState({
    administeredBy: "",
    location: "",
    notes: "",
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-100",
          badge: "bg-green-100 text-green-700",
          label: "Completed",
        }
      case "upcoming":
        return {
          icon: Clock,
          color: "text-amber-600",
          bg: "bg-amber-100",
          badge: "bg-amber-100 text-amber-700",
          label: "Upcoming",
        }
      case "overdue":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bg: "bg-red-100",
          badge: "bg-red-100 text-red-700",
          label: "Overdue",
        }
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bg: "bg-muted",
          badge: "bg-muted text-muted-foreground",
          label: "Scheduled",
        }
    }
  }

  const handleMarkComplete = (recordId: string) => {
    updateVaccinationRecord(recordId, {
      status: "completed",
      administeredDate: new Date().toISOString().split("T")[0],
      administeredBy: completeForm.administeredBy || undefined,
      location: completeForm.location || undefined,
      notes: completeForm.notes || undefined,
    })
    setMarkingComplete(null)
    setCompleteForm({ administeredBy: "", location: "", notes: "" })
  }

  return (
    <div className="space-y-4">
      {children.map((child) => {
        const childRecords = vaccinationRecords
          .filter((r) => r.childId === child.id)
          .sort((a, b) => {
            const statusOrder = { overdue: 0, upcoming: 1, completed: 2 }
            const statusDiff = statusOrder[a.status] - statusOrder[b.status]
            if (statusDiff !== 0) return statusDiff
            return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
          })

        const isExpanded = expandedChild === child.id
        const upcomingCount = childRecords.filter((r) => r.status === "upcoming").length
        const overdueCount = childRecords.filter((r) => r.status === "overdue").length

        return (
          <Card key={child.id}>
            <button
              type="button"
              onClick={() => setExpandedChild(isExpanded ? null : child.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${child.avatarColor}`}
                >
                  {child.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{child.name}</p>
                  <p className="text-sm text-muted-foreground">{childRecords.length} vaccinations tracked</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {overdueCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {overdueCount} overdue
                  </Badge>
                )}
                {upcomingCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {upcomingCount} upcoming
                  </Badge>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {isExpanded && (
              <CardContent className="border-t border-border pt-4">
                <div className="space-y-3">
                  {childRecords.map((record) => {
                    const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === record.vaccineId)
                    const statusConfig = getStatusConfig(record.status)
                    const StatusIcon = statusConfig.icon

                    return (
                      <div
                        key={record.id}
                        className="flex items-center gap-4 p-3 rounded-lg border border-border"
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
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig.badge} variant="secondary">
                            {statusConfig.label}
                          </Badge>
                          {record.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setMarkingComplete(record.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Mark Done
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      <Dialog open={!!markingComplete} onOpenChange={() => setMarkingComplete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Vaccination Complete</DialogTitle>
            <DialogDescription>
              Enter the details of the vaccination administration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="administeredBy">Administered By</Label>
              <Input
                id="administeredBy"
                placeholder="Doctor or nurse name"
                value={completeForm.administeredBy}
                onChange={(e) => setCompleteForm((f) => ({ ...f, administeredBy: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Clinic or hospital name"
                value={completeForm.location}
                onChange={(e) => setCompleteForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes..."
                value={completeForm.notes}
                onChange={(e) => setCompleteForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkingComplete(null)}>
              Cancel
            </Button>
            <Button onClick={() => markingComplete && handleMarkComplete(markingComplete)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

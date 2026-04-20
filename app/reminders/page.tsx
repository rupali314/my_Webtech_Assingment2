"use client"

import { useState } from "react"
import { Bell, Mail, Smartphone, Clock, CheckCircle2, Plus, Trash2 } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DataProvider, useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VACCINATION_SCHEDULE } from "@/lib/types"

function RemindersContent() {
  const { children, vaccinationRecords, reminders, getUpcomingVaccinations } = useData()
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [reminderDays, setReminderDays] = useState("7")

  const upcomingVaccinations = getUpcomingVaccinations()

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail
      case "sms":
        return Smartphone
      case "push":
        return Bell
      default:
        return Bell
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Reminders</h2>
        <p className="mt-1 text-muted-foreground">
          Manage your vaccination reminder preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reminder Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Settings</CardTitle>
            <CardDescription>Choose how you want to receive reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="email-toggle" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders via email
                  </p>
                </div>
              </div>
              <Switch
                id="email-toggle"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="push-toggle" className="font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive in-app notifications
                  </p>
                </div>
              </div>
              <Switch
                id="push-toggle"
                checked={pushEnabled}
                onCheckedChange={setPushEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <Label htmlFor="sms-toggle" className="font-medium">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text message reminders
                  </p>
                </div>
              </div>
              <Switch
                id="sms-toggle"
                checked={smsEnabled}
                onCheckedChange={setSmsEnabled}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Label htmlFor="reminder-days" className="font-medium">
                Reminder Timing
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                How many days before the appointment should we remind you?
              </p>
              <Select value={reminderDays} onValueChange={setReminderDays}>
                <SelectTrigger id="reminder-days" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">1 week before</SelectItem>
                  <SelectItem value="14">2 weeks before</SelectItem>
                  <SelectItem value="30">1 month before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
            <CardDescription>Reminders scheduled for upcoming vaccinations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingVaccinations.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming vaccinations scheduled.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingVaccinations.slice(0, 5).map((record) => {
                  const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === record.vaccineId)
                  const reminder = reminders.find((r) => r.vaccinationRecordId === record.id)

                  return (
                    <div
                      key={record.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.child.avatarColor}`}>
                        {record.child.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate text-sm">
                          {vaccine?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {record.child.name} - {formatDate(record.scheduledDate)}
                        </p>
                      </div>
                      {reminder ? (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Scheduled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Reminders */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Active Reminders</CardTitle>
          <CardDescription>All scheduled notification reminders</CardDescription>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No active reminders.</p>
              <p className="text-sm text-muted-foreground">
                Reminders will be automatically created for upcoming vaccinations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => {
                const record = vaccinationRecords.find((r) => r.id === reminder.vaccinationRecordId)
                const child = children.find((c) => c.id === reminder.childId)
                const vaccine = VACCINATION_SCHEDULE.find((v) => v.id === record?.vaccineId)
                const ReminderIcon = getReminderIcon(reminder.type)

                return (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <ReminderIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {vaccine?.name || "Vaccination Reminder"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {child?.name} - Reminder on {formatDate(reminder.reminderDate)}
                      </p>
                    </div>
                    <Badge
                      variant={reminder.status === "sent" ? "secondary" : "outline"}
                      className="capitalize"
                    >
                      {reminder.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete reminder</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default function RemindersPage() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-64">
          <AppHeader />
          <RemindersContent />
        </div>
      </div>
    </DataProvider>
  )
}

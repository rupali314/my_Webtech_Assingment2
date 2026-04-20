"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { ScheduleList } from "@/components/schedule-list"
import { DataProvider } from "@/lib/data-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List } from "lucide-react"

export default function SchedulePage() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-64">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Vaccination Schedule</h2>
              <p className="mt-1 text-muted-foreground">
                View and manage your vaccination appointments.
              </p>
            </div>

            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="list" className="gap-2">
                  <List className="w-4 h-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <ScheduleList />
              </TabsContent>
              <TabsContent value="calendar">
                <ScheduleCalendar />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </DataProvider>
  )
}

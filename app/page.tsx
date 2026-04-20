"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { UpcomingVaccinations } from "@/components/upcoming-vaccinations"
import { ChildrenOverview } from "@/components/children-overview"
import { QuickActions } from "@/components/quick-actions"
import { AIInsightsCard } from "@/components/ai-insights-card"
import { VaccinationTimeline } from "@/components/vaccination-timeline"
import { DataProvider } from "@/lib/data-context"

export default function DashboardPage() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-72">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            {/* Hero Section */}
            <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border p-6 sm:p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="text-sm font-medium text-primary mb-1">Welcome back</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
                  {"Keep your children protected with timely vaccinations"}
                </h2>
                <p className="mt-2 text-muted-foreground max-w-xl">
                  {"Track immunization schedules, get AI-powered reminders, and never miss an important vaccination date."}
                </p>
              </div>
            </div>

            {/* Stats */}
            <DashboardStats />

            {/* Main Grid */}
            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                <AIInsightsCard />
                <UpcomingVaccinations />
                <VaccinationTimeline />
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                <ChildrenOverview />
                <QuickActions />
              </div>
            </div>
          </main>
        </div>
      </div>
    </DataProvider>
  )
}

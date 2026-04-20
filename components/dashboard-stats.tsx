"use client"

import { CheckCircle2, Clock, AlertTriangle, Baby, TrendingUp, ArrowUpRight } from "lucide-react"
import { useData } from "@/lib/data-context"
import { cn } from "@/lib/utils"

export function DashboardStats() {
  const { children, vaccinationRecords, getOverdueVaccinations, getUpcomingVaccinations } = useData()

  const completedCount = vaccinationRecords.filter((r) => r.status === "completed").length
  const upcomingCount = getUpcomingVaccinations().length
  const overdueCount = getOverdueVaccinations().length
  const totalScheduled = vaccinationRecords.length
  const completionRate = totalScheduled > 0 ? Math.round((completedCount / totalScheduled) * 100) : 0

  const stats = [
    {
      label: "Children",
      value: children.length,
      subtext: "Registered",
      icon: Baby,
      trend: null,
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Completed",
      value: completedCount,
      subtext: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      trend: { value: 12, positive: true },
      color: "from-emerald-500/20 to-emerald-600/5",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Upcoming",
      value: upcomingCount,
      subtext: "Next 30 days",
      icon: Clock,
      trend: null,
      color: "from-amber-500/20 to-amber-600/5",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      label: "Overdue",
      value: overdueCount,
      subtext: overdueCount > 0 ? "Needs attention" : "All on track",
      icon: AlertTriangle,
      trend: overdueCount > 0 ? { value: overdueCount, positive: false } : null,
      color: overdueCount > 0 ? "from-red-500/20 to-red-600/5" : "from-emerald-500/20 to-emerald-600/5",
      iconColor: overdueCount > 0 ? "text-red-500" : "text-emerald-500",
      iconBg: overdueCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "group relative rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
            "overflow-hidden"
          )}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-50",
            stat.color
          )} />
          
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className={cn(
                "flex items-center justify-center w-11 h-11 rounded-xl",
                stat.iconBg
              )}>
                <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
              </div>
              {stat.trend && (
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full",
                  stat.trend.positive 
                    ? "bg-emerald-500/10 text-emerald-600" 
                    : "bg-red-500/10 text-red-600"
                )}>
                  {stat.trend.positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 rotate-90" />
                  )}
                  {stat.trend.value}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-foreground/80 mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

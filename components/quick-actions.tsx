"use client"

import Link from "next/link"
import { Plus, Calendar, MessageSquare, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actions = [
  {
    title: "Add Child",
    description: "Register a new child",
    icon: Plus,
    href: "/children",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Schedule Vaccination",
    description: "Book an appointment",
    icon: Calendar,
    href: "/schedule",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Ask AI Assistant",
    description: "Get vaccination advice",
    icon: MessageSquare,
    href: "/assistant",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "View Records",
    description: "Vaccination history",
    icon: FileText,
    href: "/vaccinations",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.iconBg} mb-3`}
                >
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <p className="font-medium text-sm text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

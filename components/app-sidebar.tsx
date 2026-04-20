"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Baby,
  Calendar,
  Bell,
  MessageSquare,
  Settings,
  Syringe,
  MapPin,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Children", href: "/children", icon: Baby },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Vaccinations", href: "/vaccinations", icon: Syringe },
  { name: "Find Clinics", href: "/clinics", icon: MapPin },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "AI Assistant", href: "/assistant", icon: Sparkles, isAI: true },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6">
        <div className="relative">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Syringe className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-sidebar" />
        </div>
        <div>
          <span className="text-lg font-bold text-sidebar-foreground tracking-tight">VaxCare</span>
          <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">AI Powered</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Menu
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const isAI = 'isAI' in item && item.isAI
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                isAI && !isActive && "text-primary"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                isActive ? "bg-primary/20" : "bg-sidebar-accent/50 group-hover:bg-sidebar-accent"
              )}>
                <item.icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-primary" : isAI ? "text-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                )} />
              </div>
              <span className="flex-1">{item.name}</span>
              {isAI && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/20 text-primary">
                  AI
                </span>
              )}
              {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* AI Insights Card */}
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-sidebar-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-sidebar-foreground">AI Insights</p>
          </div>
          <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
            Get personalized vaccination recommendations powered by AI.
          </p>
          <Link
            href="/assistant"
            className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat with AI
          </Link>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

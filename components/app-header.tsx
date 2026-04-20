"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Bell,
  X,
  LayoutDashboard,
  Baby,
  Calendar,
  MessageSquare,
  Settings,
  Syringe,
  MapPin,
  Search,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Children", href: "/children", icon: Baby },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Vaccinations", href: "/vaccinations", icon: Syringe },
  { name: "Find Clinics", href: "/clinics", icon: MapPin },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "AI Assistant", href: "/assistant", icon: Sparkles },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { getOverdueVaccinations, getUpcomingVaccinations } = useData()
  
  const overdueCount = getOverdueVaccinations().length
  const upcomingCount = getUpcomingVaccinations().length
  const totalNotifications = overdueCount + (upcomingCount > 0 ? 1 : 0)

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:pl-72">
        {/* Mobile menu button + Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Syringe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">VaxCare</span>
          </div>
        </div>

        {/* Page title + Search */}
        <div className="hidden lg:flex items-center gap-6 flex-1">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search vaccinations, children..." 
              className="pl-10 bg-muted/50 border-0 rounded-xl h-10"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-xl" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1">
                {totalNotifications}
              </span>
            )}
          </Button>
          <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Parent</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
              JD
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-sidebar shadow-2xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Syringe className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-lg font-bold text-sidebar-foreground">VaxCare</span>
                  <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">AI Powered</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-xl text-sidebar-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="px-4 py-6 space-y-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                      isActive ? "bg-primary/20" : "bg-sidebar-accent/50"
                    )}>
                      <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
                    </div>
                    {item.name}
                    {isActive && <ChevronRight className="ml-auto w-4 h-4 text-primary" />}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

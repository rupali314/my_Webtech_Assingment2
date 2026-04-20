"use client"

import React from "react"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Navigation,
  Filter,
  Building2,
  Stethoscope,
  Pill,
  ShieldCheck,
  HeartPulse,
  Mail,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import { mockClinics } from "@/lib/mock-data"
import type { Clinic } from "@/lib/types"

const clinicTypeLabels: Record<Clinic["type"], string> = {
  hospital: "Hospital",
  pediatric: "Pediatric Clinic",
  pharmacy: "Pharmacy",
  health_department: "Health Department",
  urgent_care: "Urgent Care",
}

const clinicTypeIcons: Record<Clinic["type"], React.ElementType> = {
  hospital: Building2,
  pediatric: Stethoscope,
  pharmacy: Pill,
  health_department: ShieldCheck,
  urgent_care: HeartPulse,
}

export default function ClinicsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("distance")
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)

  const filteredClinics = useMemo(() => {
    let clinics = [...mockClinics]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      clinics = clinics.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.address.toLowerCase().includes(query) ||
          clinic.city.toLowerCase().includes(query) ||
          clinic.services.some((s) => s.toLowerCase().includes(query))
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      clinics = clinics.filter((clinic) => clinic.type === typeFilter)
    }

    // Sort
    if (sortBy === "distance") {
      clinics.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else if (sortBy === "rating") {
      clinics.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "name") {
      clinics.sort((a, b) => a.name.localeCompare(b.name))
    }

    return clinics
  }, [searchQuery, typeFilter, sortBy])

  const getTodayHours = (clinic: Clinic) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = days[new Date().getDay()]
    const todayHours = clinic.hours.find((h) => h.day === today)
    if (!todayHours || todayHours.open === "Closed") {
      return "Closed today"
    }
    return `${todayHours.open} - ${todayHours.close}`
  }

  const isOpenNow = (clinic: Clinic) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = days[new Date().getDay()]
    const todayHours = clinic.hours.find((h) => h.day === today)
    if (!todayHours || todayHours.open === "Closed") return false

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(" ")
      const [hours, minutes] = time.split(":").map(Number)
      let h = hours
      if (period === "PM" && h !== 12) h += 12
      if (period === "AM" && h === 12) h = 0
      return h * 60 + minutes
    }

    const openTime = parseTime(todayHours.open)
    const closeTime = parseTime(todayHours.close)

    return currentTime >= openTime && currentTime <= closeTime
  }

  const ClinicIcon = ({ type }: { type: Clinic["type"] }) => {
    const Icon = clinicTypeIcons[type]
    return <Icon className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="lg:pl-64">
        <AppHeader />
        <main className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Find Vaccination Clinics</h1>
              <p className="mt-1 text-muted-foreground">
                Locate nearby clinics and healthcare providers for your child's vaccinations
              </p>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, address, or services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Clinic Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="pediatric">Pediatric Clinic</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="health_department">Health Department</SelectItem>
                        <SelectItem value="urgent_care">Urgent Care</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Nearest</SelectItem>
                        <SelectItem value="rating">Top Rated</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredClinics.length} clinic{filteredClinics.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Clinic Cards */}
            <div className="grid gap-4">
              {filteredClinics.map((clinic) => (
                <Card key={clinic.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Clinic Type Badge Area */}
                      <div className="flex items-center justify-center w-full md:w-24 p-4 bg-secondary/50">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <ClinicIcon type={clinic.type} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {clinicTypeLabels[clinic.type]}
                          </span>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-foreground text-balance">{clinic.name}</h3>
                                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>
                                    {clinic.address}, {clinic.city}, {clinic.state} {clinic.zipCode}
                                  </span>
                                </div>
                              </div>
                              {clinic.distance && (
                                <Badge variant="secondary" className="shrink-0">
                                  <Navigation className="w-3 h-3 mr-1" />
                                  {clinic.distance} mi
                                </Badge>
                              )}
                            </div>

                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <a href={`tel:${clinic.phone}`} className="hover:text-primary">
                                  {clinic.phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{getTodayHours(clinic)}</span>
                                {isOpenNow(clinic) ? (
                                  <Badge variant="outline" className="ml-1 text-xs text-success border-success/30 bg-success/10">
                                    Open
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="ml-1 text-xs">
                                    Closed
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-accent text-accent" />
                                <span className="font-medium">{clinic.rating}</span>
                                <span className="text-muted-foreground">({clinic.reviewCount} reviews)</span>
                              </div>
                            </div>

                            {/* Services */}
                            <div className="flex flex-wrap gap-1.5">
                              {clinic.services.slice(0, 3).map((service) => (
                                <Badge key={service} variant="outline" className="text-xs font-normal">
                                  {service}
                                </Badge>
                              ))}
                              {clinic.services.length > 3 && (
                                <Badge variant="outline" className="text-xs font-normal">
                                  +{clinic.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 lg:flex-col lg:items-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedClinic(clinic)}>
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                                      <ClinicIcon type={clinic.type} />
                                    </div>
                                    {clinic.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                  {/* Contact Info */}
                                  <div className="space-y-3">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                      Contact Information
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                        <span className="text-sm">
                                          {clinic.address}, {clinic.city}, {clinic.state} {clinic.zipCode}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <a href={`tel:${clinic.phone}`} className="text-sm hover:text-primary">
                                          {clinic.phone}
                                        </a>
                                      </div>
                                      {clinic.email && (
                                        <div className="flex items-center gap-3">
                                          <Mail className="w-4 h-4 text-muted-foreground" />
                                          <a href={`mailto:${clinic.email}`} className="text-sm hover:text-primary">
                                            {clinic.email}
                                          </a>
                                        </div>
                                      )}
                                      {clinic.website && (
                                        <div className="flex items-center gap-3">
                                          <Globe className="w-4 h-4 text-muted-foreground" />
                                          <a
                                            href={clinic.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm hover:text-primary flex items-center gap-1"
                                          >
                                            Visit Website
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Hours */}
                                  <div className="space-y-3">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                      Hours of Operation
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {clinic.hours.map((h) => (
                                        <div key={h.day} className="flex justify-between gap-4 py-1">
                                          <span className="text-muted-foreground">{h.day}</span>
                                          <span className="font-medium">
                                            {h.open === "Closed" ? "Closed" : `${h.open} - ${h.close}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Services */}
                                  <div className="space-y-3">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                      Services Offered
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {clinic.services.map((service) => (
                                        <Badge key={service} variant="secondary" className="font-normal">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          {service}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Insurance */}
                                  {clinic.acceptsInsurance && clinic.insuranceAccepted && (
                                    <div className="space-y-3">
                                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                        Insurance Accepted
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {clinic.insuranceAccepted.map((ins) => (
                                          <Badge key={ins} variant="outline" className="font-normal">
                                            {ins}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex gap-3 pt-2">
                                    <Button className="flex-1" asChild>
                                      <a href={`tel:${clinic.phone}`}>
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Now
                                      </a>
                                    </Button>
                                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                                      <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(
                                          `${clinic.address}, ${clinic.city}, ${clinic.state} ${clinic.zipCode}`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Get Directions
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" asChild>
                              <a href={`tel:${clinic.phone}`}>
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredClinics.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No clinics found</h3>
                    <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                      Try adjusting your search query or filters to find vaccination clinics near you.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-transparent"
                      onClick={() => {
                        setSearchQuery("")
                        setTypeFilter("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Helpful Tips */}
            <Card className="bg-secondary/30 border-secondary">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Tips for Your Visit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>Bring your child's immunization record to every appointment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>Call ahead to confirm vaccine availability and appointment requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>Have your insurance card ready - many vaccines are covered at no cost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>Ask about any current vaccine shortages or delays</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

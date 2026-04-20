"use client"

import { useState } from "react"
import { Search, Filter, Syringe, Info } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DataProvider } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VACCINATION_SCHEDULE } from "@/lib/types"

function VaccinationsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ageFilter, setAgeFilter] = useState("all")

  const ageGroups = [
    { value: "all", label: "All Ages" },
    { value: "0-2", label: "Birth - 2 months" },
    { value: "2-6", label: "2 - 6 months" },
    { value: "6-12", label: "6 - 12 months" },
    { value: "12-24", label: "12 - 24 months" },
    { value: "24+", label: "24+ months" },
  ]

  const filteredVaccines = VACCINATION_SCHEDULE.filter((vaccine) => {
    const matchesSearch =
      vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.diseases.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))

    if (ageFilter === "all") return matchesSearch

    const ageMonths = vaccine.ageMonths
    switch (ageFilter) {
      case "0-2":
        return matchesSearch && ageMonths >= 0 && ageMonths < 2
      case "2-6":
        return matchesSearch && ageMonths >= 2 && ageMonths < 6
      case "6-12":
        return matchesSearch && ageMonths >= 6 && ageMonths < 12
      case "12-24":
        return matchesSearch && ageMonths >= 12 && ageMonths < 24
      case "24+":
        return matchesSearch && ageMonths >= 24
      default:
        return matchesSearch
    }
  })

  // Group vaccines by age
  const groupedVaccines = filteredVaccines.reduce(
    (groups, vaccine) => {
      const key = vaccine.ageLabel
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(vaccine)
      return groups
    },
    {} as Record<string, typeof filteredVaccines>
  )

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Vaccination Reference</h2>
        <p className="mt-1 text-muted-foreground">
          Learn about recommended childhood vaccinations and their schedules.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vaccines or diseases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(groupedVaccines).map(([ageLabel, vaccines]) => (
          <div key={ageLabel}>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Badge variant="secondary" className="text-sm font-normal">
                {ageLabel}
              </Badge>
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vaccines.map((vaccine) => (
                <Card key={vaccine.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Syringe className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{vaccine.name}</CardTitle>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="w-4 h-4" />
                            <span className="sr-only">More info</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{vaccine.name}</DialogTitle>
                            <DialogDescription>{vaccine.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-foreground mb-2">Recommended Age</h4>
                              <p className="text-sm text-muted-foreground">{vaccine.ageLabel}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground mb-2">Protects Against</h4>
                              <div className="flex flex-wrap gap-2">
                                {vaccine.diseases.map((disease) => (
                                  <Badge key={disease} variant="outline">
                                    {disease}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {vaccine.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {vaccine.diseases.slice(0, 3).map((disease) => (
                        <Badge key={disease} variant="secondary" className="text-xs">
                          {disease}
                        </Badge>
                      ))}
                      {vaccine.diseases.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{vaccine.diseases.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filteredVaccines.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-1">No vaccines found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

export default function VaccinationsPage() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-64">
          <AppHeader />
          <VaccinationsContent />
        </div>
      </div>
    </DataProvider>
  )
}

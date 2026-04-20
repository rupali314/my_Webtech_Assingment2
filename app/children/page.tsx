"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, ChevronRight, Trash2 } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DataProvider, useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VACCINATION_SCHEDULE } from "@/lib/types"

function ChildrenContent() {
  const { children, addChild, deleteChild, getChildVaccinations } = useData()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleteChildId, setDeleteChildId] = useState<string | null>(null)
  const [newChild, setNewChild] = useState({
    name: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female",
  })

  const avatarColors = [
    "bg-pink-100 text-pink-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-amber-100 text-amber-600",
    "bg-purple-100 text-purple-600",
  ]

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()

    if (years === 0) {
      const adjustedMonths = months + (today.getDate() < birth.getDate() ? -1 : 0)
      return `${Math.max(0, adjustedMonths)} months old`
    }
    if (years === 1 && months < 0) {
      return `${12 + months} months old`
    }
    return `${years} ${years === 1 ? "year" : "years"} old`
  }

  const getCompletionRate = (childId: string) => {
    const records = getChildVaccinations(childId)
    const completedCount = records.filter((r) => r.status === "completed").length
    return Math.round((completedCount / VACCINATION_SCHEDULE.length) * 100)
  }

  const handleAddChild = () => {
    if (!newChild.name || !newChild.dateOfBirth) return

    addChild({
      name: newChild.name,
      dateOfBirth: newChild.dateOfBirth,
      gender: newChild.gender,
      avatarColor: avatarColors[children.length % avatarColors.length],
    })
    setNewChild({ name: "", dateOfBirth: "", gender: "male" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteChild = () => {
    if (deleteChildId) {
      deleteChild(deleteChildId)
      setDeleteChildId(null)
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Children</h2>
          <p className="mt-1 text-muted-foreground">Manage your registered children.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Child</DialogTitle>
              <DialogDescription>
                Enter your child&apos;s information to start tracking their vaccinations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter child's name"
                  value={newChild.name}
                  onChange={(e) => setNewChild((c) => ({ ...c, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={newChild.dateOfBirth}
                  onChange={(e) => setNewChild((c) => ({ ...c, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={newChild.gender}
                  onValueChange={(value: "male" | "female") =>
                    setNewChild((c) => ({ ...c, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddChild} disabled={!newChild.name || !newChild.dateOfBirth}>
                Add Child
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => {
          const completionRate = getCompletionRate(child.id)
          const records = getChildVaccinations(child.id)
          const completedCount = records.filter((r) => r.status === "completed").length

          return (
            <Card key={child.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Link href={`/children/${child.id}`}>
                  <div className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold ${child.avatarColor}`}
                        >
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{child.name}</h3>
                          <p className="text-sm text-muted-foreground">{calculateAge(child.dateOfBirth)}</p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">{child.gender}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Vaccination Progress</span>
                        <span className="font-medium text-foreground">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {completedCount} of {VACCINATION_SCHEDULE.length} completed
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="px-6 py-3 border-t border-border bg-muted/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteChildId(child.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {children.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">No children registered</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first child to start tracking vaccinations.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteChildId} onOpenChange={() => setDeleteChildId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Child</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this child? This will also delete all their vaccination records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChild}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

export default function ChildrenPage() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-64">
          <AppHeader />
          <ChildrenContent />
        </div>
      </div>
    </DataProvider>
  )
}

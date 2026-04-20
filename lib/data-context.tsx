"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Child, VaccinationRecord, Reminder } from "./types"
import { mockChildren, mockVaccinationRecords, mockReminders } from "./mock-data"

interface DataContextType {
  children: Child[]
  vaccinationRecords: VaccinationRecord[]
  reminders: Reminder[]
  selectedChildId: string | null
  setSelectedChildId: (id: string | null) => void
  addChild: (child: Omit<Child, "id">) => void
  updateChild: (id: string, child: Partial<Child>) => void
  deleteChild: (id: string) => void
  updateVaccinationRecord: (id: string, record: Partial<VaccinationRecord>) => void
  addVaccinationRecord: (record: Omit<VaccinationRecord, "id">) => void
  getChildVaccinations: (childId: string) => VaccinationRecord[]
  getUpcomingVaccinations: () => Array<VaccinationRecord & { child: Child }>
  getOverdueVaccinations: () => Array<VaccinationRecord & { child: Child }>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children: childrenProp }: { children: ReactNode }) {
  const [childrenData, setChildrenData] = useState<Child[]>(mockChildren)
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>(mockVaccinationRecords)
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)
  const [selectedChildId, setSelectedChildId] = useState<string | null>(mockChildren[0]?.id || null)

  const addChild = (child: Omit<Child, "id">) => {
    const newChild: Child = {
      ...child,
      id: `child-${Date.now()}`,
    }
    setChildrenData((prev) => [...prev, newChild])
  }

  const updateChild = (id: string, child: Partial<Child>) => {
    setChildrenData((prev) => prev.map((c) => (c.id === id ? { ...c, ...child } : c)))
  }

  const deleteChild = (id: string) => {
    setChildrenData((prev) => prev.filter((c) => c.id !== id))
    setVaccinationRecords((prev) => prev.filter((r) => r.childId !== id))
    if (selectedChildId === id) {
      setSelectedChildId(childrenData.find((c) => c.id !== id)?.id || null)
    }
  }

  const updateVaccinationRecord = (id: string, record: Partial<VaccinationRecord>) => {
    setVaccinationRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...record } : r)))
  }

  const addVaccinationRecord = (record: Omit<VaccinationRecord, "id">) => {
    const newRecord: VaccinationRecord = {
      ...record,
      id: `vr-${Date.now()}`,
    }
    setVaccinationRecords((prev) => [...prev, newRecord])
  }

  const getChildVaccinations = (childId: string) => {
    return vaccinationRecords.filter((r) => r.childId === childId)
  }

  const getUpcomingVaccinations = () => {
    const today = new Date()
    const upcoming = vaccinationRecords.filter((r) => {
      if (r.status !== "upcoming") return false
      const scheduled = new Date(r.scheduledDate)
      return scheduled >= today
    })
    return upcoming
      .map((r) => ({
        ...r,
        child: childrenData.find((c) => c.id === r.childId)!,
      }))
      .filter((r) => r.child)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
  }

  const getOverdueVaccinations = () => {
    const overdue = vaccinationRecords.filter((r) => r.status === "overdue")
    return overdue
      .map((r) => ({
        ...r,
        child: childrenData.find((c) => c.id === r.childId)!,
      }))
      .filter((r) => r.child)
  }

  return (
    <DataContext.Provider
      value={{
        children: childrenData,
        vaccinationRecords,
        reminders,
        selectedChildId,
        setSelectedChildId,
        addChild,
        updateChild,
        deleteChild,
        updateVaccinationRecord,
        addVaccinationRecord,
        getChildVaccinations,
        getUpcomingVaccinations,
        getOverdueVaccinations,
      }}
    >
      {childrenProp}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

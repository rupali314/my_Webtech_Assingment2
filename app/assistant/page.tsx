"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { AIChatInterface } from "@/components/ai-chat-interface"
import { DataProvider } from "@/lib/data-context"

export default function AssistantPage() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-64 flex flex-col h-screen">
          <AppHeader />
          <main className="flex-1 flex flex-col overflow-hidden">
            <AIChatInterface />
          </main>
        </div>
      </div>
    </DataProvider>
  )
}

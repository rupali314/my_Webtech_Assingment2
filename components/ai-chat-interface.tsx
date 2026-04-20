"use client"

import React from "react"

import { useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const suggestedQuestions = [
  "What vaccines does my 2-month-old need?",
  "Are vaccines safe for babies?",
  "What are the side effects of the MMR vaccine?",
  "When should my child get the flu shot?",
  "What is the DTaP vaccine?",
  "Can vaccines be delayed?",
]

function getUIMessageText(
  msg: { parts?: Array<{ type: string; text?: string }> } | undefined
): string {
  if (!msg?.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && !!p.text)
    .map((p) => p.text)
    .join("")
}

export function AIChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const input = textareaRef.current?.value.trim()
    if (!input || isLoading) return

    sendMessage({ text: input })
    if (textareaRef.current) {
      textareaRef.current.value = ""
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSuggestionClick = (question: string) => {
    sendMessage({ text: question })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">VaxCare AI Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Ask me anything about childhood vaccinations
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                How can I help you today?
              </h3>
              <p className="text-muted-foreground">
                I can answer questions about childhood vaccines, schedules, side effects, and more.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {suggestedQuestions.map((question) => (
                <Card
                  key={question}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSuggestionClick(question)}
                >
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground">{question}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-8">
              Note: This AI provides general information only. Always consult your pediatrician for
              medical advice.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => {
              const isUser = message.role === "user"
              const text = getUIMessageText(message)

              return (
                <div
                  key={message.id}
                  className={cn("flex gap-3", isUser && "flex-row-reverse")}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      isUser ? "bg-primary text-primary-foreground" : "bg-primary/10"
                    )}
                  >
                    {isUser ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex-1 rounded-xl px-4 py-3 max-w-[85%]",
                      isUser
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-card border border-border"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{text}</p>
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              placeholder="Ask about vaccines, schedules, or safety..."
              className="min-h-[52px] max-h-32 resize-none"
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[52px] w-[52px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          {messages.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground"
              onClick={() => setMessages([])}
            >
              Clear conversation
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}

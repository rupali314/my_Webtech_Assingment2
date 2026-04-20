import React from "react"
import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DataProvider } from '@/lib/data-context'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'VaxCare - Child Vaccination Reminder System',
  description: 'AI-powered vaccination tracking and reminders for your children. Never miss an important immunization date.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`font-sans antialiased`}>
        <DataProvider>
          {children}
        </DataProvider>
        <Analytics />
      </body>
    </html>
  )
}

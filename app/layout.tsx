import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-context"
import { AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "HATOMS - Transport Order Management System",
  description: "Multi-Tenant Transport Management System",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Sonner />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Willkommen bei HATOMS</h1>
        <p className="text-muted-foreground">
          Hallo {user.name}, hier ist eine Übersicht Ihrer Aufträge und Aktivitäten.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Aufträge</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">+2 seit gestern</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Bearbeitung</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Aktiv bearbeitet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geschlossen (Monat)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+12% zum Vormonat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umsatz (Monat)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€ 45.231</div>
            <p className="text-xs text-muted-foreground">+8% zum Vormonat</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Package className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Offene Aufträge</CardTitle>
            <CardDescription>Verwalte aktuelle Transportaufträge</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auftrage/offen">Zu den Aufträgen</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Clock className="h-10 w-10 text-primary mb-2" />
            <CardTitle>In Bearbeitung</CardTitle>
            <CardDescription>Aufträge die aktuell bearbeitet werden</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auftrage/in-bearbeitung">Zur Übersicht</Link>
            </Button>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Verwaltung</CardTitle>
              <CardDescription>Kunden, Benutzer und Mitarbeiter verwalten</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/verwaltung/kunden">Zur Verwaltung</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

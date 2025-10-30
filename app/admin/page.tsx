"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Key, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const router = useRouter()

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Zentrale Verwaltung für alle Mandanten und Benutzer</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Firmen</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 diesen Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Benutzer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+18 diesen Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Lizenzen</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">3 laufen bald ab</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monatlicher Umsatz</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€ 12.450</div>
            <p className="text-xs text-muted-foreground">+8% zum Vormonat</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Building2 className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Firmen verwalten</CardTitle>
            <CardDescription>Firmen anlegen, bearbeiten und Lizenzen verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/firmen">Zu den Firmen</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Benutzer verwalten</CardTitle>
            <CardDescription>Benutzer suchen, anlegen und verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/admin/benutzer">Zu den Benutzern</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Key className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Lizenzen</CardTitle>
            <CardDescription>Lizenzen erstellen und zuweisen</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/admin/lizenzen">Zu den Lizenzen</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

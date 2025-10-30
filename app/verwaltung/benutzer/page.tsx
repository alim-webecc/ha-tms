"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Plus, Search, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Demo-Benutzerdaten
const DEMO_USERS = [
  {
    id: "admin",
    name: "Admin User",
    email: "admin@th-spedition.de",
    rolle: "Admin",
    status: "Aktiv",
    letzterLogin: "12.10.2025, 14:30",
    erstellt: "01.01.2025",
  },
  {
    id: "user",
    name: "Normal User",
    email: "user@th-spedition.de",
    rolle: "Benutzer",
    status: "Aktiv",
    letzterLogin: "12.10.2025, 10:15",
    erstellt: "15.02.2025",
  },
  {
    id: "semet",
    name: "Semet Transport",
    email: "semet@transport.de",
    rolle: "Benutzer",
    status: "Aktiv",
    letzterLogin: "10.10.2025, 16:45",
    erstellt: "20.03.2025",
  },
  {
    id: "alim",
    name: "Alim Logistik",
    email: "alim@logistik.de",
    rolle: "Benutzer",
    status: "Inaktiv",
    letzterLogin: "05.09.2025, 09:20",
    erstellt: "10.04.2025",
  },
]

export default function BenutzerVerwaltenPage() {
  const [searchName, setSearchName] = useState("")

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Benutzer verwalten</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neuer Benutzer
        </Button>
      </div>

      {/* Filter-Bereich */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-card rounded-lg border">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Benutzername</label>
          <Input placeholder="Name suchen..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Benutzer-ID</label>
          <Input placeholder="ID suchen..." />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Rolle</label>
          <Input placeholder="Admin/Benutzer" />
        </div>
        <div className="flex items-end gap-2">
          <Button variant="outline" className="gap-2 flex-1 bg-transparent">
            <Search className="h-4 w-4" />
            Suchen
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabelle */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Benutzer-ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Letzter Login</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.rolle === "Admin" ? "default" : "secondary"}>{user.rolle}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "Aktiv" ? "default" : "outline"}>{user.status}</Badge>
                </TableCell>
                <TableCell>{user.letzterLogin}</TableCell>
                <TableCell>{user.erstellt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem>Passwort zurücksetzen</DropdownMenuItem>
                      <DropdownMenuItem>Rolle ändern</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Deaktivieren</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">4 Benutzer</p>
      </div>
    </div>
  )
}

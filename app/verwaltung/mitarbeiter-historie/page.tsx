"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, RefreshCw, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Demo-Mitarbeiter-Beschäftigungshistorie
const DEMO_HISTORY = [
  {
    id: "1",
    mitarbeiter: "Admin User",
    mitarbeiterId: "admin",
    aktion: "Login",
    datum: "12.10.2025, 14:30:15",
    details: "Erfolgreicher Login",
    ip: "192.168.1.100",
  },
  {
    id: "2",
    mitarbeiter: "Admin User",
    mitarbeiterId: "admin",
    aktion: "Auftrag erstellt",
    datum: "12.10.2025, 14:35:22",
    details: "Auftrag 10000007 erstellt",
    ip: "192.168.1.100",
  },
  {
    id: "3",
    mitarbeiter: "Normal User",
    mitarbeiterId: "user",
    aktion: "Login",
    datum: "12.10.2025, 10:15:45",
    details: "Erfolgreicher Login",
    ip: "192.168.1.105",
  },
  {
    id: "4",
    mitarbeiter: "Normal User",
    mitarbeiterId: "user",
    aktion: "Auftrag bearbeitet",
    datum: "12.10.2025, 10:20:33",
    details: "Auftrag 10000005 Status geändert",
    ip: "192.168.1.105",
  },
  {
    id: "5",
    mitarbeiter: "Admin User",
    mitarbeiterId: "admin",
    aktion: "Benutzer erstellt",
    datum: "11.10.2025, 16:45:12",
    details: "Neuer Benutzer 'semet' erstellt",
    ip: "192.168.1.100",
  },
  {
    id: "6",
    mitarbeiter: "Semet Transport",
    mitarbeiterId: "semet",
    aktion: "Login",
    datum: "10.10.2025, 16:45:30",
    details: "Erfolgreicher Login",
    ip: "192.168.1.110",
  },
  {
    id: "7",
    mitarbeiter: "Admin User",
    mitarbeiterId: "admin",
    aktion: "Kunde erstellt",
    datum: "10.10.2025, 09:20:15",
    details: "Neuer Kunde 'Logistik GmbH' erstellt",
    ip: "192.168.1.100",
  },
  {
    id: "8",
    mitarbeiter: "Alim Logistik",
    mitarbeiterId: "alim",
    aktion: "Logout",
    datum: "05.09.2025, 17:30:00",
    details: "Benutzer abgemeldet",
    ip: "192.168.1.115",
  },
]

export default function MitarbeiterHistoriePage() {
  const [searchMitarbeiter, setSearchMitarbeiter] = useState("")

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mitarbeiter Beschäftigungshistorie</h1>
      </div>

      {/* Filter-Bereich */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-card rounded-lg border">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Mitarbeiter</label>
          <Input
            placeholder="Name suchen..."
            value={searchMitarbeiter}
            onChange={(e) => setSearchMitarbeiter(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Mitarbeiter-ID</label>
          <Input placeholder="ID suchen..." />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Aktion</label>
          <Input placeholder="Login, Auftrag..." />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Datum von</label>
          <Input type="date" />
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

      {/* Info-Banner */}
      <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium">Hinweis:</span>
          <span className="text-muted-foreground">
            Die Historie zeigt alle Aktivitäten der letzten 90 Tage. Ältere Einträge werden archiviert.
          </span>
        </div>
      </div>

      {/* Tabelle */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum & Uhrzeit</TableHead>
              <TableHead>Mitarbeiter</TableHead>
              <TableHead>Mitarbeiter-ID</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP-Adresse</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_HISTORY.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.datum}</TableCell>
                <TableCell>{entry.mitarbeiter}</TableCell>
                <TableCell>{entry.mitarbeiterId}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry.aktion === "Login" ? "default" : entry.aktion.includes("erstellt") ? "default" : "secondary"
                    }
                  >
                    {entry.aktion}
                  </Badge>
                </TableCell>
                <TableCell>{entry.details}</TableCell>
                <TableCell className="text-muted-foreground">{entry.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">8 Einträge</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Zurück
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

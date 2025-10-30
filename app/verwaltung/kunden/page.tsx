"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Plus, Search, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Demo-Kundendaten
const DEMO_CUSTOMERS = [
  {
    id: "K001",
    name: "Logistik GmbH",
    kontaktperson: "Max Mustermann",
    email: "max@logistik-gmbh.de",
    telefon: "+49 123 456789",
    adresse: "Musterstraße 1, 85565 München",
    status: "Aktiv",
    auftraege: 15,
  },
  {
    id: "K002",
    name: "Transport AG",
    kontaktperson: "Anna Schmidt",
    email: "anna@transport-ag.de",
    telefon: "+49 987 654321",
    adresse: "Hauptstraße 42, 89865 Berlin",
    status: "Aktiv",
    auftraege: 8,
  },
  {
    id: "K003",
    name: "Spedition Meyer",
    kontaktperson: "Peter Meyer",
    email: "peter@spedition-meyer.de",
    telefon: "+49 555 123456",
    adresse: "Industrieweg 5, 85276 Hamburg",
    status: "Inaktiv",
    auftraege: 3,
  },
]

export default function KundenVerwaltenPage() {
  const [searchName, setSearchName] = useState("")

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kunden verwalten</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neuer Kunde
        </Button>
      </div>

      {/* Filter-Bereich */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-card rounded-lg border">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Kundenname</label>
          <Input placeholder="Name suchen..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Kunden-ID</label>
          <Input placeholder="K001" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Status</label>
          <Input placeholder="Aktiv/Inaktiv" />
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
              <TableHead>Kunden-ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Kontaktperson</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aufträge</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_CUSTOMERS.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.kontaktperson}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.telefon}</TableCell>
                <TableCell>{customer.adresse}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === "Aktiv" ? "default" : "secondary"}>{customer.status}</Badge>
                </TableCell>
                <TableCell>{customer.auftraege}</TableCell>
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
                      <DropdownMenuItem>Aufträge anzeigen</DropdownMenuItem>
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
        <p className="text-sm text-muted-foreground">3 Kunden</p>
      </div>
    </div>
  )
}

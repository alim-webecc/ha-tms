"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, RotateCw, MoreVertical, History } from "lucide-react"

const mockClosedOrders = [
  {
    id: "10000014",
    geber: "dan",
    ladedatum: "2025-09-18",
    vonPLZ: "84565",
    entladedatum: "2025-10-04",
    nachPLZ: "85309",
    preisKunde: "3.500,00 €",
    preisFF: "1.800,00 €",
    frachtfuhrer: "semet",
    ldm: "30",
    gewicht: "350",
    bemerkung: "test",
  },
  {
    id: "10000005",
    geber: "diyar",
    ladedatum: "2025-09-12",
    vonPLZ: "85276",
    entladedatum: "2025-08-14",
    nachPLZ: "85301",
    preisKunde: "15.000,00 €",
    preisFF: "10.000,00 €",
    frachtfuhrer: "diyar",
    ldm: "54",
    gewicht: "254",
    bemerkung: "",
  },
  {
    id: "10000011",
    geber: "test",
    ladedatum: "2025-09-17",
    vonPLZ: "89865",
    entladedatum: "2025-08-30",
    nachPLZ: "85301",
    preisKunde: "1.090,00 €",
    preisFF: "500,00 €",
    frachtfuhrer: "diyar",
    ldm: "2",
    gewicht: "10",
    bemerkung: "test",
  },
  {
    id: "10000013",
    geber: "sss",
    ladedatum: "2025-09-16",
    vonPLZ: "ssss",
    entladedatum: "2025-08-07",
    nachPLZ: "",
    preisKunde: "1.500,00 €",
    preisFF: "",
    frachtfuhrer: "",
    ldm: "",
    gewicht: "",
    bemerkung: "test",
  },
  {
    id: "10000008",
    geber: "dafs",
    ladedatum: "2025-09-12",
    vonPLZ: "45454",
    entladedatum: "2025-08-22",
    nachPLZ: "85301",
    preisKunde: "1.500,00 €",
    preisFF: "500,00 €",
    frachtfuhrer: "diyar",
    ldm: "454",
    gewicht: "1241",
    bemerkung: "dsaf",
  },
]

const mockHistory = [
  { status: "Offen", aktion: "Neu angelegt", datum: "09.09.25, 12:12:31", benutzer: "admin" },
  { status: "Offen", aktion: "Aktualisiert", datum: "09.09.25, 12:13:29", benutzer: "admin" },
  { status: "In Bearbeitung", aktion: "Nur Status geändert", datum: "09.09.25, 12:14:00", benutzer: "admin" },
  { status: "Offen", aktion: "Nur Status geändert", datum: "09.09.25, 19:14:12", benutzer: "admin" },
  { status: "In Bearbeitung", aktion: "Nur Status geändert", datum: "09.09.25, 20:22:43", benutzer: "user" },
  { status: "Offen", aktion: "Nur Status geändert", datum: "09.09.25, 20:49:19", benutzer: "admin" },
  { status: "Offen", aktion: "Aktualisiert", datum: "10.09.25, 22:36:13", benutzer: "admin" },
  { status: "Offen", aktion: "Aktualisiert", datum: "10.09.25, 22:54:04", benutzer: "admin" },
  { status: "Offen", aktion: "Aktualisiert", datum: "12.09.25, 16:43:41", benutzer: "admin" },
  { status: "In Bearbeitung", aktion: "Bearbeitet", datum: "12.10.25, 12:46:54", benutzer: "admin" },
  { status: "Geschlossen", aktion: "Bearbeitet", datum: "12.10.25, 12:47:42", benutzer: "admin" },
]

export default function VerwaltenPage() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState("")

  const openHistory = (orderId: string) => {
    setSelectedOrderId(orderId)
    setHistoryOpen(true)
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Geschlossene Aufträge</h1>

      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-1">
          <Input placeholder="z.B. 100000*" />
          <p className="text-xs text-muted-foreground mt-1">Auftrags-ID</p>
        </div>
        <div className="md:col-span-1">
          <Input placeholder="Name*" />
          <p className="text-xs text-muted-foreground mt-1">Auftragsgeber</p>
        </div>
        <div className="md:col-span-1">
          <Input type="date" placeholder="tt.mm.jjjj" />
          <p className="text-xs text-muted-foreground mt-1">Ladedatum ab</p>
        </div>
        <div className="md:col-span-1">
          <Input placeholder="85*" />
          <p className="text-xs text-muted-foreground mt-1">von (PLZ)</p>
        </div>
        <div className="md:col-span-1">
          <Input type="date" placeholder="tt.mm.jjjj" />
          <p className="text-xs text-muted-foreground mt-1">Entladedatum ab</p>
        </div>
        <div className="md:col-span-1">
          <Input placeholder="30*" />
          <p className="text-xs text-muted-foreground mt-1">nach (PLZ)</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input placeholder="Firma*" className="max-w-xs" />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Auftrags-ID</TableHead>
                <TableHead>Auftragsgeber</TableHead>
                <TableHead>Ladedatum</TableHead>
                <TableHead>von (PLZ)</TableHead>
                <TableHead>Entladedatum</TableHead>
                <TableHead>nach (PLZ)</TableHead>
                <TableHead>Preis Kunde</TableHead>
                <TableHead>Preis FF</TableHead>
                <TableHead>Frachtführer</TableHead>
                <TableHead>LDM</TableHead>
                <TableHead>Gewicht (kg)</TableHead>
                <TableHead>Bemerk...</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClosedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.geber}</TableCell>
                  <TableCell>{order.ladedatum}</TableCell>
                  <TableCell>{order.vonPLZ}</TableCell>
                  <TableCell>{order.entladedatum}</TableCell>
                  <TableCell>{order.nachPLZ}</TableCell>
                  <TableCell>{order.preisKunde}</TableCell>
                  <TableCell>{order.preisFF}</TableCell>
                  <TableCell>{order.frachtfuhrer}</TableCell>
                  <TableCell>{order.ldm}</TableCell>
                  <TableCell>{order.gewicht}</TableCell>
                  <TableCell className="max-w-[120px] truncate">{order.bemerkung}</TableCell>
                  <TableCell>
                    <div className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menü öffnen</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2" onClick={() => openHistory(order.id)}>
                            <History className="h-4 w-4" />
                            Änderungshistory
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">5 Treffer</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="default" size="icon">
            1
          </Button>
          <Button variant="outline" size="icon" disabled>
            &gt;
          </Button>
        </div>
      </div>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Änderungshistory</DialogTitle>
            <p className="text-sm text-muted-foreground">Auftrags-ID: {selectedOrderId}</p>
          </DialogHeader>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Aktion</TableHead>
                  <TableHead>Datum & Uhrzeit</TableHead>
                  <TableHead>Benutzer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.status}</TableCell>
                    <TableCell>{entry.aktion}</TableCell>
                    <TableCell>{entry.datum}</TableCell>
                    <TableCell>{entry.benutzer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setHistoryOpen(false)}>Schließen</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

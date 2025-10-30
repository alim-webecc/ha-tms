"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, RotateCw, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"

const mockOrders = [
  {
    id: "10000007",
    geber: "amat",
    ladedatum: "2025-09-05",
    vonPLZ: "85565",
    entladedatum: "2025-10-04",
    nachPLZ: "85309",
    preisKunde: "3.500,00 €",
    preisFF: "1.800,00 €",
    frachtfuhrer: "semet",
    ldm: "30",
    gewicht: "350",
    bemerkung: "test1",
  },
  {
    id: "10000006",
    geber: "mirigul",
    ladedatum: "2024-12-20",
    vonPLZ: "89865",
    entladedatum: "2025-09-19",
    nachPLZ: "85309",
    preisKunde: "2.000,00 €",
    preisFF: "1.500,00 €",
    frachtfuhrer: "alim",
    ldm: "20",
    gewicht: "200",
    bemerkung: "test",
  },
  {
    id: "10000003",
    geber: "diyar",
    ladedatum: "2025-08-16",
    vonPLZ: "85276",
    entladedatum: "2025-08-14",
    nachPLZ: "85301",
    preisKunde: "15.000,00 €",
    preisFF: "10.000,00 €",
    frachtfuhrer: "diyar",
    ldm: "30",
    gewicht: "3000",
    bemerkung: "test",
  },
  {
    id: "10000002",
    geber: "test",
    ladedatum: "2025-08-15",
    vonPLZ: "85565",
    entladedatum: "2025-08-30",
    nachPLZ: "85301",
    preisKunde: "1.090,00 €",
    preisFF: "500,00 €",
    frachtfuhrer: "diyar",
    ldm: "0.14",
    gewicht: "0.01",
    bemerkung: "bemerkungste",
  },
  {
    id: "10000001",
    geber: "diyar",
    ladedatum: "2025-08-28",
    vonPLZ: "",
    entladedatum: "2025-08-07",
    nachPLZ: "",
    preisKunde: "1.500,00 €",
    preisFF: "",
    frachtfuhrer: "",
    ldm: "",
    gewicht: "2000",
    bemerkung: "",
  },
  {
    id: "10000000",
    geber: "alim",
    ladedatum: "2025-07-29",
    vonPLZ: "89865",
    entladedatum: "2025-08-22",
    nachPLZ: "85301",
    preisKunde: "",
    preisFF: "",
    frachtfuhrer: "",
    ldm: "",
    gewicht: "",
    bemerkung: "dfasdfs",
  },
]

export default function AuftragePage() {
  const [searchId, setSearchId] = useState("")
  const [searchGeber, setSearchGeber] = useState("")
  const [searchFrachtfuhrer, setSearchFrachtfuhrer] = useState("")

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Offene Aufträge</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neuer Auftrag
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-1">
          <Input placeholder="z.B. 100000*" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">Auftrags-ID</p>
        </div>
        <div className="md:col-span-1">
          <Input placeholder="Name*" value={searchGeber} onChange={(e) => setSearchGeber(e.target.value)} />
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
        <Input
          placeholder="Firma*"
          value={searchFrachtfuhrer}
          onChange={(e) => setSearchFrachtfuhrer(e.target.value)}
          className="max-w-xs"
        />
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
              {mockOrders.map((order) => (
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
                          <DropdownMenuItem asChild>
                            <Link href={`/auftrage/${order.id}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Ansehen
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Löschen
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
        <p className="text-sm text-muted-foreground">6 Treffer</p>
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
    </div>
  )
}

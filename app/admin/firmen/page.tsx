"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, Power, Upload, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Firma {
  id: string
  kennung: string
  name: string
  logo?: string
  status: "aktiv" | "inaktiv" | "gesperrt"
  lizenzTyp: string
  benutzerAnzahl: number
  ablaufdatum: string
}

const DEMO_FIRMEN: Firma[] = [
  {
    id: "1",
    kennung: "TH001",
    name: "TH Spedition GmbH",
    logo: "/placeholder.svg",
    status: "aktiv",
    lizenzTyp: "Premium",
    benutzerAnzahl: 25,
    ablaufdatum: "2025-12-31",
  },
  {
    id: "2",
    kennung: "LOG002",
    name: "Logistik Express AG",
    status: "aktiv",
    lizenzTyp: "Standard",
    benutzerAnzahl: 15,
    ablaufdatum: "2025-08-15",
  },
  {
    id: "3",
    kennung: "TRANS003",
    name: "Trans Europe Services",
    status: "inaktiv",
    lizenzTyp: "Basic",
    benutzerAnzahl: 8,
    ablaufdatum: "2024-12-31",
  },
]

export default function FirmenPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [firmen, setFirmen] = useState(DEMO_FIRMEN)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFirma, setEditingFirma] = useState<Firma | null>(null)
  const { toast } = useToast()

  const filteredFirmen = firmen.filter(
    (firma) =>
      firma.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firma.kennung.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (firma: Firma) => {
    setEditingFirma(firma)
    setDialogOpen(true)
  }

  const handleDelete = (firma: Firma) => {
    if (confirm(`Möchten Sie die Firma "${firma.name}" wirklich löschen?`)) {
      setFirmen(firmen.filter((f) => f.id !== firma.id))
      toast({
        title: "Firma gelöscht",
        description: `${firma.name} wurde erfolgreich gelöscht.`,
      })
    }
  }

  const handleToggleStatus = (firma: Firma) => {
    const newStatus = firma.status === "aktiv" ? "inaktiv" : "aktiv"
    setFirmen(firmen.map((f) => (f.id === firma.id ? { ...f, status: newStatus } : f)))
    toast({
      title: "Status geändert",
      description: `${firma.name} ist jetzt ${newStatus}.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktiv":
        return <Badge className="bg-green-500">Aktiv</Badge>
      case "inaktiv":
        return <Badge variant="secondary">Inaktiv</Badge>
      case "gesperrt":
        return <Badge variant="destructive">Gesperrt</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Firmen verwalten</h1>
            <p className="text-muted-foreground mt-1">{filteredFirmen.length} Firmen gefunden</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Neue Firma
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Firma suchen</CardTitle>
            <CardDescription>Suchen Sie nach Firmenkennung oder Name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Firmenkennung oder Name eingeben..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alle Firmen</CardTitle>
            <CardDescription>Übersicht aller registrierten Firmen</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firma</TableHead>
                  <TableHead>Kennung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lizenz</TableHead>
                  <TableHead className="text-right">Benutzer</TableHead>
                  <TableHead>Ablaufdatum</TableHead>
                  <TableHead className="w-[100px] text-center">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFirmen.map((firma) => (
                  <TableRow key={firma.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={firma.logo || "/placeholder.svg"} />
                          <AvatarFallback>{firma.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{firma.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{firma.kennung}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(firma.status)}</TableCell>
                    <TableCell>{firma.lizenzTyp}</TableCell>
                    <TableCell className="text-right font-mono">{firma.benutzerAnzahl}</TableCell>
                    <TableCell>{firma.ablaufdatum}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Details anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(firma)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Logo hochladen
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleStatus(firma)}>
                            <Power className="mr-2 h-4 w-4" />
                            {firma.status === "aktiv" ? "Deaktivieren" : "Aktivieren"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => handleDelete(firma)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFirma ? "Firma bearbeiten" : "Neue Firma anlegen"}</DialogTitle>
            <DialogDescription>
              {editingFirma ? "Bearbeiten Sie die Firmendaten" : "Erstellen Sie eine neue Firma mit Lizenz"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kennung">Firmenkennung *</Label>
                <Input id="kennung" placeholder="z.B. TH001" defaultValue={editingFirma?.kennung} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Firmenname *</Label>
                <Input id="name" placeholder="z.B. TH Spedition GmbH" defaultValue={editingFirma?.name} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lizenz">Lizenztyp *</Label>
                <Select defaultValue={editingFirma?.lizenzTyp || "standard"}>
                  <SelectTrigger id="lizenz">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="benutzer">Max. Benutzer *</Label>
                <Input id="benutzer" type="number" placeholder="25" defaultValue={editingFirma?.benutzerAnzahl} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ablauf">Ablaufdatum *</Label>
                <Input id="ablauf" type="date" defaultValue={editingFirma?.ablaufdatum} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select defaultValue={editingFirma?.status || "aktiv"}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktiv">Aktiv</SelectItem>
                    <SelectItem value="inaktiv">Inaktiv</SelectItem>
                    <SelectItem value="gesperrt">Gesperrt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Firmenlogo</Label>
              <div className="flex items-center gap-4">
                <Input id="logo" type="file" accept="image/*" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Hochladen
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG oder SVG (max. 2MB)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(false)
                setEditingFirma(null)
                toast({
                  title: editingFirma ? "Firma aktualisiert" : "Firma erstellt",
                  description: editingFirma
                    ? "Die Firmendaten wurden erfolgreich aktualisiert."
                    : "Die neue Firma wurde erfolgreich angelegt.",
                })
              }}
            >
              {editingFirma ? "Speichern" : "Erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

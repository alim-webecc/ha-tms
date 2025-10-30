"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Eye, Edit, History, Trash2, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { AssignOrderDialog } from "./assign-order-dialog"
import { useToast } from "@/hooks/use-toast"

export interface Order {
  id: string
  auftraggeber: string
  ladedatum: string
  vonPLZ: string
  entladedatum: string
  nachPLZ: string
  preisKunde: string
  preisFF: string
  frachtfuehrer: string
  ldm: string
  gewicht: string
  bemerkung: string
  status?: "offen" | "in-bearbeitung" | "geschlossen"
  prioritaet?: "niedrig" | "normal" | "hoch"
}

interface OrderTableProps {
  orders: Order[]
  onRowClick?: (order: Order) => void
  onBulkAction?: (action: string, selectedIds: string[]) => void
}

export function OrderTable({ orders, onRowClick, onBulkAction }: OrderTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<string | null>(null)
  const { toast } = useToast()

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    setSelectedIds((prev) => (prev.length === orders.length ? [] : orders.map((o) => o.id)))
  }

  const handleAssignClick = (orderId: string) => {
    setSelectedOrderForAssign(orderId)
    setAssignDialogOpen(true)
  }

  const handleAssign = (userId: string, note: string) => {
    toast({
      title: "Auftrag zugewiesen",
      description: `Auftrag ${selectedOrderForAssign} wurde erfolgreich zugewiesen.`,
    })
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "offen":
        return <Badge variant="outline">Offen</Badge>
      case "in-bearbeitung":
        return <Badge className="bg-blue-500">In Bearbeitung</Badge>
      case "geschlossen":
        return <Badge variant="secondary">Geschlossen</Badge>
      default:
        return null
    }
  }

  const getPrioritaetBadge = (prioritaet?: string) => {
    switch (prioritaet) {
      case "hoch":
        return (
          <Badge variant="destructive" className="text-xs">
            Hoch
          </Badge>
        )
      case "normal":
        return (
          <Badge variant="secondary" className="text-xs">
            Normal
          </Badge>
        )
      case "niedrig":
        return (
          <Badge variant="outline" className="text-xs">
            Niedrig
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-sm font-medium">{selectedIds.length} ausgewählt</span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={() => onBulkAction?.("export", selectedIds)}>
                Exportieren
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                Abbrechen
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox checked={selectedIds.length === orders.length} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead>Auftrags-ID</TableHead>
                  <TableHead>Auftraggeber</TableHead>
                  <TableHead>Ladedatum</TableHead>
                  <TableHead>von (PLZ)</TableHead>
                  <TableHead>Entladedatum</TableHead>
                  <TableHead>nach (PLZ)</TableHead>
                  <TableHead className="text-right">Preis Kunde</TableHead>
                  <TableHead className="text-right">Preis FF</TableHead>
                  <TableHead>Frachtführer</TableHead>
                  <TableHead className="text-right">LDM</TableHead>
                  <TableHead className="text-right">Gewicht (kg)</TableHead>
                  <TableHead>Bemerkung</TableHead>
                  <TableHead className="w-[100px] text-center">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={cn("cursor-pointer hover:bg-muted/50", selectedIds.includes(order.id) && "bg-muted")}
                    onClick={() => onRowClick?.(order)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(order.id)}
                        onCheckedChange={() => toggleSelection(order.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/auftrage/${order.id}`}
                        className="text-primary hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.auftraggeber}</TableCell>
                    <TableCell>{order.ladedatum}</TableCell>
                    <TableCell>{order.vonPLZ}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.entladedatum}
                        {order.prioritaet && getPrioritaetBadge(order.prioritaet)}
                      </div>
                    </TableCell>
                    <TableCell>{order.nachPLZ}</TableCell>
                    <TableCell className="text-right font-mono">{order.preisKunde}</TableCell>
                    <TableCell className="text-right font-mono">{order.preisFF}</TableCell>
                    <TableCell>{order.frachtfuehrer}</TableCell>
                    <TableCell className="text-right font-mono">{order.ldm}</TableCell>
                    <TableCell className="text-right font-mono">{order.gewicht}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.bemerkung}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()} className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 mx-auto">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/auftrage/${order.id}`} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleAssignClick(order.id)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Zuweisen
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <History className="mr-2 h-4 w-4" />
                            Änderungshistorie
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer">
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
          </div>
        </div>
      </div>

      {/* Assign Dialog */}
      <AssignOrderDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        orderId={selectedOrderForAssign || ""}
        onAssign={handleAssign}
      />
    </>
  )
}

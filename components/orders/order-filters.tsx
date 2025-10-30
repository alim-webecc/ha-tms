"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, X, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OrderFiltersProps {
  onFilterChange?: (filters: any) => void
}

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [filters, setFilters] = useState({
    auftragsId: "",
    auftraggeber: "",
    ladedatumVon: "",
    ladedatumBis: "",
    vonPLZ: "",
    entladedatumVon: "",
    entladedatumBis: "",
    nachPLZ: "",
    frachtfuehrer: "",
    status: "all",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    if (value && !activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key])
    } else if (!value && activeFilters.includes(key)) {
      setActiveFilters(activeFilters.filter((f) => f !== key))
    }
  }

  const handleSearch = () => {
    onFilterChange?.(filters)
  }

  const handleReset = () => {
    setFilters({
      auftragsId: "",
      auftraggeber: "",
      ladedatumVon: "",
      ladedatumBis: "",
      vonPLZ: "",
      entladedatumVon: "",
      entladedatumBis: "",
      nachPLZ: "",
      frachtfuehrer: "",
      status: "all",
    })
    setActiveFilters([])
    onFilterChange?.({})
  }

  return (
    <div className="space-y-4">
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2 border-b">
          <span className="text-sm text-muted-foreground self-center">Aktive Filter:</span>
          {activeFilters.map((key) => (
            <Badge key={key} variant="secondary" className="gap-1 cursor-pointer">
              {key}: {filters[key as keyof typeof filters]}
              <button onClick={() => handleFilterChange(key, "")} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="bg-muted/50 rounded-lg border p-4">
        <div className="flex items-end gap-3 overflow-x-auto pb-2">
          <div className="space-y-2 min-w-[140px]">
            <Label htmlFor="auftragsId" className="text-xs">
              Auftrags-ID
            </Label>
            <Input
              id="auftragsId"
              placeholder="z.B. 10000001"
              value={filters.auftragsId}
              onChange={(e) => handleFilterChange("auftragsId", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 min-w-[140px]">
            <Label htmlFor="auftraggeber" className="text-xs">
              Auftraggeber
            </Label>
            <Input
              id="auftraggeber"
              placeholder="Name"
              value={filters.auftraggeber}
              onChange={(e) => handleFilterChange("auftraggeber", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 min-w-[140px]">
            <Label htmlFor="ladedatumVon" className="text-xs">
              Ladedatum von
            </Label>
            <Input
              id="ladedatumVon"
              type="date"
              value={filters.ladedatumVon}
              onChange={(e) => handleFilterChange("ladedatumVon", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 min-w-[140px]">
            <Label htmlFor="ladedatumBis" className="text-xs">
              Ladedatum bis
            </Label>
            <Input
              id="ladedatumBis"
              type="date"
              value={filters.ladedatumBis}
              onChange={(e) => handleFilterChange("ladedatumBis", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 min-w-[100px]">
            <Label htmlFor="vonPLZ" className="text-xs">
              von (PLZ)
            </Label>
            <Input
              id="vonPLZ"
              placeholder="85565"
              maxLength={5}
              value={filters.vonPLZ}
              onChange={(e) => handleFilterChange("vonPLZ", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 min-w-[100px]">
            <Label htmlFor="nachPLZ" className="text-xs">
              nach (PLZ)
            </Label>
            <Input
              id="nachPLZ"
              placeholder="85309"
              maxLength={5}
              value={filters.nachPLZ}
              onChange={(e) => handleFilterChange("nachPLZ", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 min-w-[140px]">
            <Label htmlFor="frachtfuehrer" className="text-xs">
              Frachtführer
            </Label>
            <Input
              id="frachtfuehrer"
              placeholder="Firma"
              value={filters.frachtfuehrer}
              onChange={(e) => handleFilterChange("frachtfuehrer", e.target.value)}
              className="h-9"
            />
          </div>

          {/* <div className="space-y-2 min-w-[140px]">
            <Label htmlFor="status" className="text-xs">
              Status
            </Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger id="status" className="h-9">
                <SelectValue placeholder="Alle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="offen">Offen</SelectItem>
                <SelectItem value="in-bearbeitung">In Bearbeitung</SelectItem>
                <SelectItem value="geschlossen">Geschlossen</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <div className="flex items-end gap-2 ml-auto">
            <Button onClick={handleSearch} className="gap-2 h-9">
              <Search className="h-4 w-4" />
              Suchen
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2 h-9 bg-transparent">
              <X className="h-4 w-4" />
              Zurücksetzen
            </Button>
            {/* <Button variant="ghost" size="icon" className="h-9 w-9">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2 h-9 bg-transparent">
              <Save className="h-4 w-4" />
              Speichern
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

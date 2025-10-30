"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepRessourcenProps {
  data: any
  onChange: (data: any) => void
}

export function StepRessourcen({ data, onChange }: StepRessourcenProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frachtfuehrer">Frachtführer *</Label>
          <Select>
            <SelectTrigger id="frachtfuehrer">
              <SelectValue placeholder="Frachtführer auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semet">semet</SelectItem>
              <SelectItem value="alim">alim</SelectItem>
              <SelectItem value="diyar">diyar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fahrer">Fahrer (optional)</Label>
          <Select>
            <SelectTrigger id="fahrer">
              <SelectValue placeholder="Fahrer zuweisen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fahrer1">Max Mustermann</SelectItem>
              <SelectItem value="fahrer2">John Doe</SelectItem>
              <SelectItem value="fahrer3">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fahrzeug">Fahrzeugtyp</Label>
          <Select>
            <SelectTrigger id="fahrzeug">
              <SelectValue placeholder="Fahrzeug auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lkw">LKW (7,5t)</SelectItem>
              <SelectItem value="sattelzug">Sattelzug</SelectItem>
              <SelectItem value="sprinter">Sprinter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kennzeichen">Kennzeichen (optional)</Label>
          <Input id="kennzeichen" placeholder="z.B. M-AB 1234" />
        </div>
      </div>
    </div>
  )
}

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepSendungProps {
  data: any
  onChange: (data: any) => void
}

export function StepSendung({ data, onChange }: StepSendungProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sendungsart">Sendungsart *</Label>
          <Select>
            <SelectTrigger id="sendungsart">
              <SelectValue placeholder="Art auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teilladung">Teilladung</SelectItem>
              <SelectItem value="komplettladung">Komplettladung</SelectItem>
              <SelectItem value="express">Express</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verpackung">Verpackungsart</Label>
          <Select>
            <SelectTrigger id="verpackung">
              <SelectValue placeholder="Verpackung auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="palette">Palette</SelectItem>
              <SelectItem value="karton">Karton</SelectItem>
              <SelectItem value="lose">Lose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gewicht">Gewicht (kg) *</Label>
          <Input id="gewicht" type="number" placeholder="z.B. 350" min="0" step="0.01" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ldm">Lademeter (LDM) *</Label>
          <Input id="ldm" type="number" placeholder="z.B. 30" min="0" step="0.1" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="laenge">Länge (cm)</Label>
          <Input id="laenge" type="number" placeholder="z.B. 120" min="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="breite">Breite (cm)</Label>
          <Input id="breite" type="number" placeholder="z.B. 80" min="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hoehe">Höhe (cm)</Label>
          <Input id="hoehe" type="number" placeholder="z.B. 100" min="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anzahl">Anzahl Packstücke</Label>
          <Input id="anzahl" type="number" placeholder="z.B. 10" min="1" />
        </div>
      </div>
    </div>
  )
}

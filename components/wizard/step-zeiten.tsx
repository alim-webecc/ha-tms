"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepZeitenProps {
  data: any
  onChange: (data: any) => void
}

export function StepZeiten({ data, onChange }: StepZeitenProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ladedatum">Ladedatum *</Label>
          <Input id="ladedatum" type="date" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ladezeit">Ladezeit (optional)</Label>
          <Input id="ladezeit" type="time" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="entladedatum">Entladedatum *</Label>
          <Input id="entladedatum" type="date" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="entladezeit">Entladezeit (optional)</Label>
          <Input id="entladezeit" type="time" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prioritaet">Priorität</Label>
          <Select>
            <SelectTrigger id="prioritaet">
              <SelectValue placeholder="Priorität wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="niedrig">Niedrig</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="hoch">Hoch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sla">SLA-Level</Label>
          <Select>
            <SelectTrigger id="sla">
              <SelectValue placeholder="SLA auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (3-5 Tage)</SelectItem>
              <SelectItem value="express">Express (1-2 Tage)</SelectItem>
              <SelectItem value="overnight">Overnight</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

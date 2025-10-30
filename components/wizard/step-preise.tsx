"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StepPreiseProps {
  data: any
  onChange: (data: any) => void
}

export function StepPreise({ data, onChange }: StepPreiseProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preis-kunde">Preis Kunde (€) *</Label>
          <Input id="preis-kunde" type="number" placeholder="z.B. 3500.00" min="0" step="0.01" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preis-ff">Preis Frachtführer (€) *</Label>
          <Input id="preis-ff" type="number" placeholder="z.B. 1800.00" min="0" step="0.01" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zusatzkosten">Zusatzkosten (€)</Label>
          <Input id="zusatzkosten" type="number" placeholder="z.B. 150.00" min="0" step="0.01" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="waehrung">Währung</Label>
          <Input id="waehrung" value="EUR" disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kostenhinweise">Kostenhinweise / Bemerkungen</Label>
        <Textarea id="kostenhinweise" placeholder="Zusätzliche Informationen zu Kosten..." rows={3} />
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Geschätzte Marge:</span>
          <span className="text-2xl font-bold text-green-600">€ 1.700,00</span>
        </div>
      </div>
    </div>
  )
}

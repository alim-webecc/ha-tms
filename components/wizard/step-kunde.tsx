"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface StepKundeProps {
  data: any
  onChange: (data: any) => void
}

export function StepKunde({ data, onChange }: StepKundeProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kunde">Kunde / Auftraggeber *</Label>
          <Select>
            <SelectTrigger id="kunde">
              <SelectValue placeholder="Kunde auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amat">amat</SelectItem>
              <SelectItem value="mirigul">mirigul</SelectItem>
              <SelectItem value="diyar">diyar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ansprechpartner">Ansprechpartner</Label>
          <Input id="ansprechpartner" placeholder="Name des Ansprechpartners" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" type="email" placeholder="email@beispiel.de" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefon">Telefon</Label>
          <Input id="telefon" type="tel" placeholder="+49 123 456789" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notizen">Notizen zum Kunden</Label>
        <Textarea id="notizen" placeholder="Zusätzliche Informationen..." rows={3} />
      </div>
    </div>
  )
}

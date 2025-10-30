"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface StepRelationenProps {
  data: any
  onChange: (data: any) => void
}

export function StepRelationen({ data, onChange }: StepRelationenProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-green-600" />
            Abholung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="abhol-plz">PLZ *</Label>
              <Input id="abhol-plz" placeholder="z.B. 85565" maxLength={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abhol-ort">Ort *</Label>
              <Input id="abhol-ort" placeholder="Stadt" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="abhol-strasse">Straße & Hausnummer</Label>
              <Input id="abhol-strasse" placeholder="Musterstraße 123" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="abhol-hinweise">Hinweise zur Abholung</Label>
              <Textarea id="abhol-hinweise" placeholder="z.B. Hintereingang, Anmeldung erforderlich..." rows={2} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-red-600" />
            Anlieferung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="anliefer-plz">PLZ *</Label>
              <Input id="anliefer-plz" placeholder="z.B. 85309" maxLength={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anliefer-ort">Ort *</Label>
              <Input id="anliefer-ort" placeholder="Stadt" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="anliefer-strasse">Straße & Hausnummer</Label>
              <Input id="anliefer-strasse" placeholder="Beispielweg 456" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="anliefer-hinweise">Hinweise zur Anlieferung</Label>
              <Textarea id="anliefer-hinweise" placeholder="z.B. Zeitfenster, Besonderheiten..." rows={2} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

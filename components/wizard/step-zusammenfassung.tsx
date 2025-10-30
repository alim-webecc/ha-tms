"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"

interface StepZusammenfassungProps {
  data: any
  onChange: (data: any) => void
}

export function StepZusammenfassung({ data, onChange }: StepZusammenfassungProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-5 w-5" />
        <p className="font-medium">Alle erforderlichen Informationen wurden erfasst</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kunde & Kontakt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Kunde:</span> <span className="font-medium">amat</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ansprechpartner:</span>{" "}
              <span className="font-medium">Max Mustermann</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sendungsdetails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Art:</span> <span className="font-medium">Teilladung</span>
            </div>
            <div>
              <span className="text-muted-foreground">Gewicht:</span> <span className="font-medium">350 kg</span>
            </div>
            <div>
              <span className="text-muted-foreground">LDM:</span> <span className="font-medium">30</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Von:</span> <span className="font-medium">85565 München</span>
            </div>
            <div>
              <span className="text-muted-foreground">Nach:</span> <span className="font-medium">85309 Berlin</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zeiten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Ladedatum:</span> <span className="font-medium">05.09.2025</span>
            </div>
            <div>
              <span className="text-muted-foreground">Entladedatum:</span>{" "}
              <span className="font-medium">04.10.2025</span>
            </div>
            <div>
              <span className="text-muted-foreground">Priorität:</span>{" "}
              <Badge variant="destructive" className="ml-2">
                Hoch
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ressourcen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Frachtführer:</span> <span className="font-medium">semet</span>
            </div>
            <div>
              <span className="text-muted-foreground">Fahrzeugtyp:</span> <span className="font-medium">LKW 7,5t</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Preis Kunde:</span>{" "}
              <span className="font-medium">€ 3.500,00</span>
            </div>
            <div>
              <span className="text-muted-foreground">Preis FF:</span> <span className="font-medium">€ 1.800,00</span>
            </div>
            <Separator className="my-2" />
            <div>
              <span className="text-muted-foreground">Marge:</span>{" "}
              <span className="font-bold text-green-600">€ 1.700,00</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

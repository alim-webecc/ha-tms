"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react"
import { StepKunde } from "@/components/wizard/step-kunde"
import { StepSendung } from "@/components/wizard/step-sendung"
import { StepRelationen } from "@/components/wizard/step-relationen"
import { StepZeiten } from "@/components/wizard/step-zeiten"
import { StepRessourcen } from "@/components/wizard/step-ressourcen"
import { StepPreise } from "@/components/wizard/step-preise"
import { StepZusammenfassung } from "@/components/wizard/step-zusammenfassung"
import { toast } from "sonner"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog"

const STEPS = [
  { id: 1, title: "Kunde & Kontakt", component: StepKunde },
  { id: 2, title: "Sendungsdetails", component: StepSendung },
  { id: 3, title: "Relationen", component: StepRelationen },
  { id: 4, title: "Zeiten & SLAs", component: StepZeiten },
  { id: 5, title: "Ressourcen", component: StepRessourcen },
  { id: 6, title: "Preise & Kosten", component: StepPreise },
  { id: 7, title: "Zusammenfassung", component: StepZusammenfassung },
]

export default function NeuerAuftragPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  useUnsavedChanges(hasUnsavedChanges)

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setHasUnsavedChanges(true)
    }
  }, [formData])

  const progress = (currentStep / STEPS.length) * 100
  const CurrentStepComponent = STEPS[currentStep - 1].component

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      toast.success("Schritt gespeichert")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    setHasUnsavedChanges(false)
    toast.success("Entwurf gespeichert")
  }

  const handleSubmit = () => {
    setHasUnsavedChanges(false)
    toast.success("Auftrag erfolgreich erstellt!")
    router.push("/auftrage/offen")
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation("/auftrage/offen")
      setShowUnsavedDialog(true)
    } else {
      router.push("/auftrage/offen")
    }
  }

  const handleConfirmLeave = () => {
    setHasUnsavedChanges(false)
    setShowUnsavedDialog(false)
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
  }

  const handleCancelLeave = () => {
    setShowUnsavedDialog(false)
    setPendingNavigation(null)
  }

  return (
    <>
      <div className="container max-w-5xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Neuen Auftrag erstellen</h1>
            <p className="text-muted-foreground mt-1">
              Schritt {currentStep} von {STEPS.length}: {STEPS[currentStep - 1].title}
            </p>
          </div>
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            Als Entwurf speichern
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex-1 text-center transition-colors cursor-pointer ${
                  step.id === currentStep ? "text-primary font-medium" : "hover:text-foreground"
                } ${step.id < currentStep ? "text-green-600" : ""}`}
              >
                {step.id < currentStep ? <Check className="inline h-3 w-3 mr-1" /> : null}
                {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>Füllen Sie die erforderlichen Felder aus</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent data={formData} onChange={setFormData} />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Abbrechen
          </Button>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </Button>
            )}
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} className="gap-2">
                Weiter
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2">
                <Check className="h-4 w-4" />
                Auftrag erstellen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </>
  )
}

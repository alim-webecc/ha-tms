"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import { StepKunde } from "@/components/wizard/step-kunde";
import { StepSendung } from "@/components/wizard/step-sendung";
import { StepRelationen } from "@/components/wizard/step-relationen";
import { StepZeiten } from "@/components/wizard/step-zeiten";
import { StepRessourcen } from "@/components/wizard/step-ressourcen";
import { StepPreise } from "@/components/wizard/step-preise";
import { StepZusammenfassung } from "@/components/wizard/step-zusammenfassung";
import { toast } from "sonner";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";

// Für die Erfolgsmeldung nach dem Speichern (Nummer formatieren)
import pad8 from "@/app/utils/pad8";

const STEPS = [
  { id: 1, title: "Kunde & Kontakt", component: StepKunde },
  { id: 2, title: "Sendungsdetails", component: StepSendung },
  { id: 3, title: "Relationen", component: StepRelationen },
  { id: 4, title: "Zeiten & SLAs", component: StepZeiten },
  { id: 5, title: "Ressourcen", component: StepRessourcen },
  { id: 6, title: "Preise & Kosten", component: StepPreise },
  { id: 7, title: "Zusammenfassung", component: StepZusammenfassung },
];

export default function NeuerAuftragPage() {
  const router = useRouter();

  // ⚠️ Auftragsnummer wird NICHT mehr vorab geladen.
  // Sie wird beim Speichern serverseitig vergeben (race-safe).

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  useUnsavedChanges(hasUnsavedChanges);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [formData]);

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      toast.success("Schritt gespeichert");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    setHasUnsavedChanges(false);
    toast.success("Entwurf gespeichert");
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ⚠️ KEINE orderNumber senden – Nummer wird im Backend vergeben
          status: "offen",
          title: (formData as any)?.title ?? null,
          tenantId: "TR", // Platzhalter bis IAM
          createdBy: "admin", // Platzhalter bis IAM
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const savedNumber: number | undefined = data?.order?.order_number;

      setHasUnsavedChanges(false);
      if (savedNumber != null) {
        toast.success(`Auftrag ${pad8(savedNumber)} erfolgreich erstellt!`);
      } else {
        toast.success("Auftrag erfolgreich erstellt!");
      }

      router.push("/auftrage/offen"); // TODO: später auf Detailseite
    } catch (e: any) {
      console.error("Speichern fehlgeschlagen:", e);
      toast.error(`Speichern fehlgeschlagen: ${e.message ?? e}`);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation("/auftrage/offen");
      setShowUnsavedDialog(true);
    } else {
      router.push("/auftrage/offen");
    }
  };

  const handleConfirmLeave = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleCancelLeave = () => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  };

  return (
    <>
      <div className="container max-w-5xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Neuen Auftrag erstellen
            </h1>
            <p className="text-muted-foreground mt-1">
              Schritt {currentStep} von {STEPS.length}:{" "}
              {STEPS[currentStep - 1].title}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="gap-2 bg-transparent"
          >
            <Save className="h-4 w-4" />
            Als Entwurf speichern
          </Button>
        </div>

        {/* Auftragsnummer-Hinweis (readonly) */}
        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Angaben</CardTitle>
            <CardDescription>
              Die Auftragsnummer wird <b>beim Speichern</b> automatisch vergeben
              und ist nicht änderbar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Auftragsnummer
                </label>
                <input
                  type="text"
                  readOnly
                  value="Wird beim Speichern vergeben"
                  className="border rounded px-3 py-2 w-full bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              Füllen Sie die erforderlichen Felder aus
            </CardDescription>
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
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="gap-2 bg-transparent"
              >
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
  );
}

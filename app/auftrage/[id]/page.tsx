// app/auftrage/[id]/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

/**
 * Next.js 15: props.params kann ein Promise sein. Wir normalisieren selbst.
 * Route-Param ist aktuell die AUFTRAGSNUMMER (gepolstert), NICHT die DB-ID.
 * Für PUT/DELETE müssen wir die DB-ID lookup'en.
 */
export default function AuftragsDetailPage(props: any) {
  const [routeOrderNumber, setRouteOrderNumber] = useState<number | null>(null); // z.B. 18 aus "00000018"
  const [dbId, setDbId] = useState<number | null>(null); // wirkliche DB-ID
  const [resolving, setResolving] = useState<boolean>(true);

  // Refs zu den Eingaben (wir lassen das UI visuell unverändert)
  const statusRef = useRef<string>("in-bearbeitung");
  const remarkRef = useRef<HTMLTextAreaElement | null>(null);

  // Param lesen (kann Promise sein)
  useEffect(() => {
    (async () => {
      const p = await props.params;
      const raw = Array.isArray(p?.id) ? p.id[0] : p?.id;
      const numeric = String(raw ?? "").replace(/^0+/, ""); // "00000018" -> "18"
      const ordNo = numeric ? Number(numeric) : NaN;
      setRouteOrderNumber(Number.isFinite(ordNo) ? ordNo : null);
    })();
  }, [props.params]);

  // DB-ID lookup (aus order_number -> id)
  useEffect(() => {
    if (routeOrderNumber == null) return;
    let active = true;

    const run = async () => {
      setResolving(true);
      try {
        // Wir haben kein Backend-Filter nach order_number,
        // deshalb holen wir (für jetzt) die Liste und filtern clientseitig.
        // Datensatzmenge ist aktuell klein; später machen wir /by-number-Endpoint.
        const res = await fetch("/api/orders?tenantId=TR", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const items: Array<any> = Array.isArray(data?.items) ? data.items : [];
        // find by order_number (Zahl)
        const found = items.find(
          (x) => Number(x?.order_number) === routeOrderNumber
        );
        if (active) {
          if (found?.id != null) {
            setDbId(Number(found.id));
          } else {
            setDbId(null);
            toast.error(
              `Kein Auftrag mit Nummer ${routeOrderNumber} gefunden (DB-ID unbekannt).`
            );
          }
        }
      } catch (e: any) {
        if (active) {
          setDbId(null);
          toast.error(`Lookup fehlgeschlagen: ${e?.message ?? e}`);
        }
      } finally {
        if (active) setResolving(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [routeOrderNumber]);

  // Anzeige-Text der Kopfzeile (immer gepolstert anzeigen)
  const paddedId = useMemo(() => {
    if (routeOrderNumber == null) return "";
    return routeOrderNumber.toString().padStart(8, "0");
  }, [routeOrderNumber]);

  const handleSave = async () => {
    if (dbId == null) {
      toast.error("Speichern nicht möglich: DB-ID unbekannt.");
      return;
    }
    try {
      const body: any = {
        // unser Backend erlaubt aktuell PUT nur für status & remark
        status: statusRef.current,
        remark: remarkRef.current?.value ?? null,
      };

      const res = await fetch(`/api/orders/${dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      toast.success(`Auftrag ${paddedId} wurde gespeichert.`);
    } catch (e: any) {
      toast.error(`Speichern fehlgeschlagen: ${e?.message ?? e}`);
    }
  };

  const handleDelete = async () => {
    if (dbId == null) {
      toast.error("Löschen nicht möglich: DB-ID unbekannt.");
      return;
    }
    try {
      const res = await fetch(`/api/orders/${dbId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark: "Gelöscht via UI" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      toast.success(`Auftrag ${paddedId} wurde gelöscht.`);
      // Zurück zur Liste
      window.location.href = "/auftrage/offen";
    } catch (e: any) {
      toast.error(`Löschen fehlgeschlagen: ${e?.message ?? e}`);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/auftrage/offen">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Auftragsdetailansicht</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auftragsinformationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="auftragsId">Auftrags-ID</Label>
              <Input id="auftragsId" value={paddedId} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                defaultValue="in-bearbeitung"
                onValueChange={(v) => (statusRef.current = v)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offen">Offen</SelectItem>
                  <SelectItem value="in-bearbeitung">In Bearbeitung</SelectItem>
                  <SelectItem value="geschlossen">Geschlossen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="geber">Auftragsgeber *</Label>
              <Input id="geber" defaultValue="gulgine" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ladedatum">Ladedatum *</Label>
              <Input id="ladedatum" type="date" defaultValue="2025-02-28" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vonPLZ">von (PLZ) *</Label>
              <Input id="vonPLZ" defaultValue="85276" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entladedatum">Entladedatum *</Label>
              <Input id="entladedatum" type="date" defaultValue="2025-09-25" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nachPLZ">nach (PLZ) *</Label>
              <Input id="nachPLZ" defaultValue="85301" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preisKunde">Preis Kunde (€) *</Label>
              <Input id="preisKunde" type="number" defaultValue="3000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preisFF">Preis FF (€) *</Label>
              <Input id="preisFF" type="number" defaultValue="1500" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="frachtfuhrer">Frachtführer *</Label>
              <Input id="frachtfuhrer" defaultValue="diyar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ldm">LDM</Label>
              <Input id="ldm" type="number" defaultValue="300" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gewicht">Gewicht (kg)</Label>
              <Input id="gewicht" type="number" defaultValue="200" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bemerkung">Bemerkung</Label>
            <Textarea
              id="bemerkung"
              defaultValue="test1"
              rows={3}
              ref={(el) => (remarkRef.current = el)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Auftragsdetails</Label>
            <Textarea id="details" defaultValue="s" rows={4} />
          </div>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" asChild>
              <Link href="/auftrage/offen">Abbrechen</Link>
            </Button>

            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={resolving || dbId == null}
            >
              {resolving ? "Lädt…" : "Speichern"}
            </Button>

            <Button onClick={handleDelete} disabled={resolving || dbId == null}>
              Löschen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

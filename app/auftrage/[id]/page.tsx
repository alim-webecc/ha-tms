"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

/**
 * Next.js 15: params kann ein Promise sein.
 * Wir typisieren nicht eng und normalisieren die ID selbst.
 */
export default function AuftragsDetailPage(props: any) {
  const router = useRouter();

  // params normalisieren (Promise oder Objekt)
  const [idStr] = (() => {
    const p = props?.params as any;
    // Kann ein Promise sein – wir versuchen synchron zu lesen; wenn Promise, fällt es auf undefined.
    // Für Client Components (hier) liefert Next die params synchron.
    const raw = (p && p.id) ?? props?.params?.id ?? "";
    const idP = Array.isArray(raw) ? raw[0] : raw;
    const s = String(idP ?? "");
    return [s] as const;
  })();

  // numerische ID für API ableiten (führende Nullen entfernen)
  const numericId = (() => {
    const trimmed = idStr.replace(/^0+/, "");
    const n = Number(trimmed);
    return Number.isFinite(n) && n > 0 ? n : Number(idStr);
  })();

  // Felder: wir ändern am Server aktuell nur Status + Remark
  const [status, setStatus] = useState<string>("in-bearbeitung");
  const remarkRef = useRef<HTMLTextAreaElement>(null);

  const busyRef = useRef(false);

  async function handleSave() {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const body = {
        status,
        remark: remarkRef.current?.value || null,
      };

      const res = await fetch(`/api/orders/${numericId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      alert("Auftrag wurde gespeichert.");
      // Optional: zurück zur Liste
      // router.push("/auftrage/offen");
    } catch (e: any) {
      console.error("PUT fehlgeschlagen:", e);
      alert(`Speichern fehlgeschlagen: ${e?.message ?? e}`);
    } finally {
      busyRef.current = false;
    }
  }

  async function handleDelete() {
    if (busyRef.current) return;
    if (!confirm("Diesen Auftrag wirklich löschen?")) return;

    busyRef.current = true;
    try {
      const body = {
        remark: remarkRef.current?.value || "Gelöscht über Detailansicht",
      };

      const res = await fetch(`/api/orders/${numericId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      alert("Auftrag wurde gelöscht.");
      router.push("/auftrage/offen");
    } catch (e: any) {
      console.error("DELETE fehlgeschlagen:", e);
      alert(`Löschen fehlgeschlagen: ${e?.message ?? e}`);
    } finally {
      busyRef.current = false;
    }
  }

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
              <Input id="auftragsId" value={idStr} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={setStatus}>
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
              ref={remarkRef}
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
            <Button variant="secondary" onClick={handleSave}>
              Speichern
            </Button>
            <Button onClick={handleDelete}>Löschen</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

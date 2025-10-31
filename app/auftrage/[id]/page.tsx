"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

export default function AuftragsDetailPage() {
  const router = useRouter();
  const params = useParams(); // <-- sicher in Client Components
  // params.id kommt als string | string[]
  const idStr = useMemo(() => {
    const raw = (params?.id ?? "") as string | string[];
    const s = Array.isArray(raw) ? raw[0] : raw;
    return String(s ?? "");
  }, [params]);

  // numerische ID (führende Nullen entfernen)
  const numericId = useMemo(() => {
    const trimmed = idStr.replace(/^0+/, "");
    const n = Number(trimmed);
    return Number.isFinite(n) && n > 0 ? n : Number(idStr);
  }, [idStr]);

  // editierbare Felder (wir schicken status/remark an die API)
  const [status, setStatus] = useState<string>("in-bearbeitung");
  const remarkRef = useRef<HTMLTextAreaElement>(null);

  const busyRef = useRef(false);

  async function handleSave() {
    console.log("[Detail] SAVE clicked", { numericId, status });
    if (!numericId || Number.isNaN(numericId)) {
      alert("Ungültige Auftrags-ID.");
      return;
    }
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
    console.log("[Detail] DELETE clicked", { numericId });
    if (!numericId || Number.isNaN(numericId)) {
      alert("Ungültige Auftrags-ID.");
      return;
    }
    if (!confirm("Diesen Auftrag wirklich löschen?")) return;
    if (busyRef.current) return;

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
            <Button variant="secondary" onClick={handleSave} type="button">
              Speichern
            </Button>
            <Button onClick={handleDelete} type="button">
              Löschen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

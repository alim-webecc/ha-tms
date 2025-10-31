"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

type ApiOrder = {
  id: string | number;
  order_number: number;
  status: string;
  shipper: string | null;
  pickup_date: string | null;
  dropoff_date: string | null;
  from_zip: string | null;
  to_zip: string | null;
  price_customer: string | null;
  price_carrier: string | null;
  ldm: number | null;
  weight_kg: number | null;
  remark: string | null;
  carrier: string | null;
  tenant_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...(init ?? {}) });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = (j as any)?.error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export default function AuftragsDetailPage(props: any) {
  // In Next.js 15 kann params ein Promise sein
  const [routeParam, setRouteParam] = useState<string>("");
  const router = useRouter();

  // UI-State (wir halten nur Felder im State, die wir wirklich speichern/löschen)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dbId, setDbId] = useState<number | null>(null);
  const [order, setOrder] = useState<ApiOrder | null>(null);

  // Bearbeitbare Felder
  const [status, setStatus] = useState<string>("in-bearbeitung");
  const remarkRef = useRef<HTMLTextAreaElement | null>(null);

  // params normalisieren
  useEffect(() => {
    (async () => {
      const p = await props.params; // Promise-safe
      const raw = p?.id;
      const id = String(Array.isArray(raw) ? raw[0] : raw ?? "");
      setRouteParam(id);
    })();
  }, [props.params]);

  // Daten laden + dbId herausfinden
  useEffect(() => {
    if (!routeParam) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let currentDbId: number | null = null;
        let fetched: ApiOrder | null = null;

        const isPaddedOrderNumber = /^\d{8}$/.test(routeParam);
        if (isPaddedOrderNumber) {
          // Route wie „/auftrage/00000018“ → order_number = 18 ermitteln
          const wanted = parseInt(routeParam, 10);

          // Wir holen einmal die Orders und suchen die passende Nummer.
          // (später gern /api/orders/by-number/<nr> als eigenen Endpunkt bauen)
          const list = await getJson<{ ok: boolean; items: ApiOrder[] }>(
            "/api/orders?tenantId=TR"
          );
          fetched =
            (list.items || []).find((o) => o.order_number === wanted) ?? null;
          currentDbId = fetched ? Number(fetched.id) : null;
        } else {
          // Route wie „/auftrage/3“ → das ist direkt die DB-ID
          currentDbId = Number(routeParam);
          const res = await getJson<{ ok: boolean; item: ApiOrder }>(
            `/api/orders/${currentDbId}`
          );
          fetched = res.item ?? null;
        }

        if (!currentDbId || !fetched) {
          throw new Error("Auftrag nicht gefunden.");
        }

        setDbId(currentDbId);
        setOrder(fetched);
        setStatus(fetched.status || "in-bearbeitung");
        // remark erst im Textarea sichtbar machen
        if (remarkRef.current) remarkRef.current.value = fetched.remark ?? "";
      } catch (e: any) {
        setError(e?.message ?? String(e));
        setOrder(null);
        setDbId(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [routeParam]);

  const onSave = async () => {
    if (!dbId) return;
    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        status,
        remark: remarkRef.current?.value ?? null,
      };
      const res = await getJson<{ ok: boolean; item: ApiOrder }>(
        `/api/orders/${dbId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      setOrder(res.item);
      window.alert("Änderungen gespeichert.");
      // zurück zur Liste
      router.push("/auftrage/offen");
    } catch (e: any) {
      setError(e?.message ?? String(e));
      window.alert(`Speichern fehlgeschlagen: ${e?.message ?? e}`);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!dbId) return;
    if (!window.confirm("Diesen Auftrag wirklich als gelöscht markieren?"))
      return;

    setDeleting(true);
    setError(null);
    try {
      const remark = remarkRef.current?.value ?? "Via UI gelöscht";
      await getJson<{ ok: boolean; item: ApiOrder }>(`/api/orders/${dbId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark }),
      });
      window.alert("Auftrag wurde gelöscht.");
      router.push("/auftrage/offen");
    } catch (e: any) {
      setError(e?.message ?? String(e));
      window.alert(`Löschen fehlgeschlagen: ${e?.message ?? e}`);
    } finally {
      setDeleting(false);
    }
  };

  // Anzeige-ID: Bei 8-stelliger Route diese, sonst DB-ID zero-padded
  const displayId = useMemo(() => {
    if (/^\d{8}$/.test(routeParam)) return routeParam;
    if (order?.order_number != null) {
      return String(order.order_number).padStart(8, "0");
    }
    return String(routeParam || "");
  }, [routeParam, order?.order_number]);

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
          {error && <div className="text-sm text-red-600">Fehler: {error}</div>}

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="auftragsId">Auftrags-ID</Label>
              <Input id="auftragsId" value={displayId} readOnly disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={loading || saving || deleting}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offen">Offen</SelectItem>
                  <SelectItem value="in-bearbeitung">In Bearbeitung</SelectItem>
                  <SelectItem value="geschlossen">Geschlossen</SelectItem>
                  <SelectItem value="gelöscht">Gelöscht</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="geber">Auftragsgeber *</Label>
              <Input id="geber" defaultValue={order?.shipper ?? ""} readOnly />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ladedatum">Ladedatum *</Label>
              <Input
                id="ladedatum"
                type="date"
                defaultValue={
                  order?.pickup_date ? order.pickup_date.slice(0, 10) : ""
                }
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vonPLZ">von (PLZ) *</Label>
              <Input
                id="vonPLZ"
                defaultValue={order?.from_zip ?? ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entladedatum">Entladedatum *</Label>
              <Input
                id="entladedatum"
                type="date"
                defaultValue={
                  order?.dropoff_date ? order.dropoff_date.slice(0, 10) : ""
                }
                readOnly
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nachPLZ">nach (PLZ) *</Label>
              <Input id="nachPLZ" defaultValue={order?.to_zip ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preisKunde">Preis Kunde (€) *</Label>
              <Input
                id="preisKunde"
                defaultValue={order?.price_customer ?? ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preisFF">Preis FF (€) *</Label>
              <Input
                id="preisFF"
                defaultValue={order?.price_carrier ?? ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="frachtfuhrer">Frachtführer *</Label>
              <Input
                id="frachtfuhrer"
                defaultValue={order?.carrier ?? ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ldm">LDM</Label>
              <Input id="ldm" defaultValue={order?.ldm ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gewicht">Gewicht (kg)</Label>
              <Input
                id="gewicht"
                defaultValue={order?.weight_kg ?? ""}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bemerkung">Bemerkung</Label>
            <Textarea
              id="bemerkung"
              defaultValue={order?.remark ?? ""}
              rows={3}
              ref={remarkRef}
              disabled={loading || saving || deleting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Auftragsdetails</Label>
            <Textarea id="details" defaultValue={""} rows={4} readOnly />
          </div>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" asChild disabled={saving || deleting}>
              <Link href="/auftrage/offen">Abbrechen</Link>
            </Button>
            <Button
              variant="secondary"
              onClick={onSave}
              disabled={loading || saving || deleting || !dbId}
            >
              {saving ? "Speichern…" : "Speichern"}
            </Button>
            <Button
              onClick={onDelete}
              disabled={loading || deleting || saving || !dbId}
            >
              {deleting ? "Löschen…" : "Löschen"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

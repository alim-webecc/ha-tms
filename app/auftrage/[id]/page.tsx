// app/auftrage/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { getOrderById, updateOrder, deleteOrder } from "@/lib/api-client";
import type { OrderRow } from "@/lib/types";

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10); // ISO → YYYY-MM-DD
}

export default function AuftragsDetailPage() {
  const params = useParams();
  const router = useRouter();

  const idStr = Array.isArray(params?.id)
    ? params.id[0]
    : (params?.id as string | undefined);
  const idNum = useMemo(() => {
    const n = Number(idStr);
    return Number.isFinite(n) ? n : NaN;
  }, [idStr]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [item, setItem] = useState<OrderRow | null>(null);

  // Editfelder (nur diese sind bearbeitbar)
  const [status, setStatus] = useState<
    "offen" | "in-bearbeitung" | "geschlossen" | "gelöscht" | string
  >("offen");
  const [remark, setRemark] = useState<string>("");

  useEffect(() => {
    if (!Number.isFinite(idNum)) {
      setErr("Ungültige ID");
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await getOrderById(idNum);
        if (!active) return;
        setItem(res.item);
        setStatus((res.item?.status as any) ?? "offen");
        setRemark(res.item?.remark ?? "");
      } catch (e: any) {
        if (!active) return;
        setErr(e?.message ?? "Fehler beim Laden");
        setItem(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [idNum]);

  async function onSave() {
    if (!Number.isFinite(idNum)) return;
    try {
      setErr(null);
      const res = await updateOrder(idNum, { status, remark });
      setItem(res.item);
    } catch (e: any) {
      setErr(e?.message ?? "Fehler beim Speichern");
    }
  }

  async function onDelete() {
    if (!Number.isFinite(idNum)) return;
    try {
      setErr(null);
      await deleteOrder(idNum, remark || "gelöscht via Detailseite");
      router.push("/auftrage/offen");
    } catch (e: any) {
      setErr(e?.message ?? "Fehler beim Löschen");
    }
  }

  const auftragsNum8 =
    item?.order_number != null
      ? String(item.order_number).padStart(8, "0")
      : idStr ?? "";

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
          {loading ? (
            <div className="text-muted-foreground">Lade…</div>
          ) : err ? (
            <div className="text-red-600">Fehler: {err}</div>
          ) : !item ? (
            <div className="text-muted-foreground">Kein Auftrag gefunden.</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="auftragsId">Auftrags-ID</Label>
                  <Input
                    id="auftragsId"
                    value={auftragsNum8}
                    readOnly
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offen">Offen</SelectItem>
                      <SelectItem value="in-bearbeitung">
                        In Bearbeitung
                      </SelectItem>
                      <SelectItem value="geschlossen">Geschlossen</SelectItem>
                      <SelectItem value="gelöscht">Gelöscht</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="geber">Auftragsgeber *</Label>
                  <Input id="geber" value={item.shipper ?? ""} readOnly />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ladedatum">Ladedatum *</Label>
                  <Input
                    id="ladedatum"
                    type="date"
                    value={fmtDate(item.pickup_date)}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vonPLZ">von (PLZ) *</Label>
                  <Input id="vonPLZ" value={item.from_zip ?? ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entladedatum">Entladedatum *</Label>
                  <Input
                    id="entladedatum"
                    type="date"
                    value={fmtDate(item.dropoff_date)}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="nachPLZ">nach (PLZ) *</Label>
                  <Input id="nachPLZ" value={item.to_zip ?? ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preisKunde">Preis Kunde (€) *</Label>
                  <Input
                    id="preisKunde"
                    value={item.price_customer ?? ""}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preisFF">Preis FF (€) *</Label>
                  <Input
                    id="preisFF"
                    value={item.price_carrier ?? ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="frachtfuhrer">Frachtführer *</Label>
                  <Input
                    id="frachtfuhrer"
                    value={item.carrier ?? item.created_by ?? ""}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldm">LDM</Label>
                  <Input id="ldm" value={item.ldm ?? ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gewicht">Gewicht (kg)</Label>
                  <Input id="gewicht" value={item.weight_kg ?? ""} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bemerkung">Bemerkung</Label>
                <Textarea
                  id="bemerkung"
                  rows={3}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Bemerkung ändern…"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Auftragsdetails</Label>
                <Textarea id="details" defaultValue="s" rows={4} readOnly />
              </div>

              <div className="flex gap-4 justify-end">
                <Button variant="outline" asChild>
                  <Link href="/auftrage/offen">Abbrechen</Link>
                </Button>
                <Button variant="secondary" onClick={onSave}>
                  Speichern
                </Button>
                <Button onClick={onDelete}>Löschen</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

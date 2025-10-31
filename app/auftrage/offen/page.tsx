"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { OrderFilters } from "@/components/orders/order-filters";
import { OrderTable, type Order } from "@/components/orders/order-table";
import { formatDate, formatEUR, pad8 } from "@/app/utils/format";

/** Rohdaten aus der API (entspricht public.orders) */
type OrderRow = {
  id: number;
  order_number: number;
  status: string;
  shipper: string | null;
  pickup_date: string | null; // "YYYY-MM-DD" oder ISO
  dropoff_date: string | null;
  from_zip: string | null;
  to_zip: string | null;
  price_customer: number | null;
  price_carrier: number | null;
  ldm: number | null;
  weight_kg: number | null;
  remark: string | null;
  carrier: string | null;
  tenant_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export default function OffeneAuftragePage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Daten laden
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/orders?tenantId=TR&status=offen", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!active) return;
        setRows(Array.isArray(data?.items) ? (data.items as OrderRow[]) : []);
      } catch (e: any) {
        console.error("Laden fehlgeschlagen:", e);
        if (!active) return;
        setError(e?.message ?? "Unbekannter Fehler");
        setRows([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  // 2) Mapping DB → UI-Order (so erwartet es <OrderTable/> & Karten)
  const orders: Order[] = useMemo(() => {
    return rows.map((r) => ({
      id: pad8(r.order_number), // 8-stellig anzeigen
      auftraggeber: r.shipper ?? "", // Auftraggeber
      ladedatum: formatDate(r.pickup_date),
      entladedatum: formatDate(r.dropoff_date),
      vonPLZ: r.from_zip ?? "",
      nachPLZ: r.to_zip ?? "",
      preisKunde: formatEUR(r.price_customer), // "3.500,00 €"
      preisFF: formatEUR(r.price_carrier),
      frachtfuehrer: r.carrier ?? r.created_by ?? "",
      ldm: r.ldm != null ? String(r.ldm) : "",
      gewicht: r.weight_kg != null ? String(r.weight_kg) : "",
      bemerkung: r.remark ?? "",
      status: r.status as any, // "offen" | "in-bearbeitung" | "geschlossen"
      prioritaet: "normal", // (vorerst statisch)
    }));
  }, [rows]);

  // 3) Map von Anzeige-ID (pad8(order_number)) → echte DB-ID
  const idMap = useMemo(() => {
    return new Map<string, number>(
      rows.map((r) => [pad8(r.order_number), r.id])
    );
  }, [rows]);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsPreviewOpen(true);
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log("[v0] Bulk action:", action, selectedIds);
  };

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Offene Aufträge
          </h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "lädt…" : `${orders.length} Aufträge gefunden`}
            {error ? ` — Fehler: ${error}` : ""}
          </p>
        </div>

        {/* Ansichtsschalter */}
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "table" | "cards")}
          className="ml-auto"
        >
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Tabelle
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Karten
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filter (noch ohne Funktion) */}
      <OrderFilters onFilterChange={() => {}} />

      {/* Tabelle oder Karten */}
      {viewMode === "table" ? (
        <OrderTable
          orders={orders}
          onRowClick={handleRowClick}
          onBulkAction={handleBulkAction}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <Card
              key={o.id}
              className="cursor-pointer transition-colors hover:border-primary"
              onClick={() => handleRowClick(o)}
            >
              <CardHeader>
                <CardTitle>Auftrag {o.id}</CardTitle>
                <CardDescription>{o.auftraggeber || "—"}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Ladedatum</div>
                  <div>{o.ladedatum || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Entladedatum</div>
                  <div>{o.entladedatum || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">von (PLZ)</div>
                  <div>{o.vonPLZ || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">nach (PLZ)</div>
                  <div>{o.nachPLZ || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Preis Kunde</div>
                  <div>{o.preisKunde || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Preis FF</div>
                  <div>{o.preisFF || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Frachtführer</div>
                  <div>{o.frachtfuehrer || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">LDM</div>
                  <div>{o.ldm || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Gewicht (kg)</div>
                  <div>{o.gewicht || "—"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Bemerkung</div>
                  <div>{o.bemerkung || "—"}</div>
                </div>
                <div className="col-span-2 flex gap-2 pt-2">
                  <Button asChild variant="default" size="sm">
                    <Link href={`/auftrage/${idMap.get(o.id) ?? ""}`}>
                      Details anzeigen
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/auftrage/${idMap.get(o.id) ?? ""}`}>
                      Bearbeiten
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vorschau-Sheet */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Auftragsvorschau</SheetTitle>
            <SheetDescription>Auftrag {selectedOrder?.id}</SheetDescription>
          </SheetHeader>

          {selectedOrder && (
            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              <div>
                <div className="text-muted-foreground">Auftraggeber</div>
                <div>{selectedOrder.auftraggeber || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Frachtführer</div>
                <div>{selectedOrder.frachtfuehrer || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Von</div>
                <div>{selectedOrder.vonPLZ || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Nach</div>
                <div>{selectedOrder.nachPLZ || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Ladedatum</div>
                <div>{selectedOrder.ladedatum || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Entladedatum</div>
                <div>{selectedOrder.entladedatum || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Preis Kunde</div>
                <div>{selectedOrder.preisKunde || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Preis FF</div>
                <div>{selectedOrder.preisFF || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">LDM</div>
                <div>{selectedOrder.ldm || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Gewicht</div>
                <div>
                  {selectedOrder.gewicht ? `${selectedOrder.gewicht} kg` : "—"}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground">Bemerkung</div>
                <div>{selectedOrder.bemerkung || "—"}</div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

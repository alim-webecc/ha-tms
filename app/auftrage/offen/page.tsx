"use client";

import { useState } from "react";
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

// Demo-Daten (unverändert gelassen)
const DEMO_ORDERS: Order[] = [
  {
    id: "10000007",
    auftraggeber: "amat",
    ladedatum: "2025-09-05",
    vonPLZ: "85565",
    entladedatum: "2025-10-04",
    nachPLZ: "85309",
    preisKunde: "3.500,00 €",
    preisFF: "1.800,00 €",
    frachtfuehrer: "semet",
    ldm: "30",
    gewicht: "350",
    bemerkung: "test1",
    status: "offen",
    prioritaet: "hoch",
  },
  {
    id: "10000006",
    auftraggeber: "mirigul",
    ladedatum: "2024-12-20",
    vonPLZ: "89865",
    entladedatum: "2025-09-19",
    nachPLZ: "85309",
    preisKunde: "2.000,00 €",
    preisFF: "1.500,00 €",
    frachtfuehrer: "alim",
    ldm: "20",
    gewicht: "200",
    bemerkung: "test",
    status: "offen",
    prioritaet: "normal",
  },
  {
    id: "10000003",
    auftraggeber: "diyar",
    ladedatum: "2025-08-16",
    vonPLZ: "85276",
    entladedatum: "2025-08-14",
    nachPLZ: "85301",
    preisKunde: "15.000,00 €",
    preisFF: "10.000,00 €",
    frachtfuehrer: "diyar",
    ldm: "30",
    gewicht: "3000",
    bemerkung: "test",
    status: "offen",
  },
];

export default function OffeneAuftragePage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
            {DEMO_ORDERS.length} Aufträge gefunden
          </p>
        </div>

        {/* Nur Ansichtsschalter – KEIN lokaler „Neuer Auftrag“-Button mehr */}
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

      {/* Filter */}
      <OrderFilters onFilterChange={() => {}} />

      {/* Tabelle oder Karten */}
      {viewMode === "table" ? (
        <OrderTable
          orders={DEMO_ORDERS}
          onRowClick={handleRowClick}
          onBulkAction={handleBulkAction}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DEMO_ORDERS.map((o) => (
            <Card
              key={o.id}
              className="cursor-pointer transition-colors hover:border-primary"
              onClick={() => handleRowClick(o)}
            >
              <CardHeader>
                <CardTitle>Auftrag {o.id}</CardTitle>
                <CardDescription>{o.auftraggeber}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Ladedatum</div>
                  <div>{o.ladedatum}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Entladedatum</div>
                  <div>{o.entladedatum}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">von (PLZ)</div>
                  <div>{o.vonPLZ}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">nach (PLZ)</div>
                  <div>{o.nachPLZ}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Preis Kunde</div>
                  <div>{o.preisKunde}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Preis FF</div>
                  <div>{o.preisFF}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Frachtführer</div>
                  <div>{o.frachtfuehrer}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">LDM</div>
                  <div>{o.ldm}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Gewicht (kg)</div>
                  <div>{o.gewicht}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Bemerkung</div>
                  <div>{o.bemerkung || "Keine"}</div>
                </div>
                <div className="col-span-2 flex gap-2 pt-2">
                  <Button variant="default" size="sm">
                    Details anzeigen
                  </Button>
                  <Button variant="outline" size="sm">
                    Bearbeiten
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
                <div>{selectedOrder.auftraggeber}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Frachtführer</div>
                <div>{selectedOrder.frachtfuehrer}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Von</div>
                <div>{selectedOrder.vonPLZ}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Nach</div>
                <div>{selectedOrder.nachPLZ}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Ladedatum</div>
                <div>{selectedOrder.ladedatum}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Entladedatum</div>
                <div>{selectedOrder.entladedatum}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Preis Kunde</div>
                <div>{selectedOrder.preisKunde}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Preis FF</div>
                <div>{selectedOrder.preisFF}</div>
              </div>
              <div>
                <div className="text-muted-foreground">LDM</div>
                <div>{selectedOrder.ldm}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Gewicht</div>
                <div>{selectedOrder.gewicht} kg</div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground">Bemerkung</div>
                <div>{selectedOrder.bemerkung || "Keine"}</div>
              </div>

              <div className="col-span-2 flex gap-2 pt-2">
                <Button variant="default" size="sm">
                  Details anzeigen
                </Button>
                <Button variant="outline" size="sm">
                  Bearbeiten
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
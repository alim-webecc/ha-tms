// lib/types.ts

// UI-Order (DEIN bestehender Typ – bleibt so!)
export interface Order {
  id: string;
  order_number: number;
  status: string;
  shipper: string | null;
  pickup_date: string | null;   // ISO
  dropoff_date: string | null;  // ISO
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
}

// Rohdaten aus der API (entspricht public.orders)
export type OrderRow = {
  id: number;
  order_number: number;
  status: "offen" | "in-bearbeitung" | "geschlossen" | "gelöscht" | string;
  shipper: string | null;
  pickup_date: string | null; // "YYYY-MM-DD" oder ISO
  dropoff_date: string | null;
  from_zip: string | null;
  to_zip: string | null;
  price_customer: number | string | null;
  price_carrier: number | string | null;
  ldm: number | null;
  weight_kg: number | null;
  remark: string | null;
  carrier: string | null;
  tenant_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// lib/types.ts
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

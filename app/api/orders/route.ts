export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pg } from "../../../lib/db";

/** -----------------------------
 *  Datentypen
 *  ---------------------------- */
type OrderRow = {
  id: number;
  order_number: number;
  status: string;
  shipper: string | null;
  pickup_date: string | null;
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

type OrderPayload = {
  status?: "offen" | "in-bearbeitung" | "geschlossen";
  shipper?: string | null;
  pickup_date?: string | null;
  dropoff_date?: string | null;
  from_zip?: string | null;
  to_zip?: string | null;
  price_customer?: number | null;
  price_carrier?: number | null;
  ldm?: number | null;
  weight_kg?: number | null;
  remark?: string | null;
  carrier?: string | null;
  tenantId?: string | null;
  createdBy?: string | null;
};

/** -----------------------------
 *  GET → Aufträge laden
 *  ---------------------------- */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Math.max(1, Math.min(Number(searchParams.get("limit") ?? 50), 200));
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  const tenantId = searchParams.get("tenantId") ?? "TR";

  const client = await pg.connect();
  try {
    const conds: string[] = ["tenant_id = $1"];
    const params: any[] = [tenantId];

    if (status && ["offen", "in-bearbeitung", "geschlossen"].includes(status)) {
      conds.push("status = $2");
      params.push(status);
    }

    params.push(limit);
    params.push(offset);

    const sql = `
      SELECT id, order_number, status, shipper, pickup_date, dropoff_date,
             from_zip, to_zip, price_customer, price_carrier, ldm, weight_kg,
             remark, carrier, tenant_id, created_by, created_at, updated_at
      FROM public.orders
      WHERE ${conds.join(" AND ")}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length};
    `;

    const { rows } = await client.query<OrderRow>(sql, params);
    return NextResponse.json({ ok: true, items: rows }, { status: 200 });
  } catch (e) {
    console.error("GET /api/orders Fehler:", e);
    return NextResponse.json({ error: "Serverfehler beim Laden" }, { status: 500 });
  } finally {
    client.release();
  }
}

/** -----------------------------
 *  POST → Auftrag speichern
 *  ---------------------------- */
export async function POST(req: Request) {
  const client = await pg.connect();
  try {
    const body = (await req.json()) as Partial<OrderPayload>;

    const status = (body.status ?? "offen") as OrderPayload["status"];
    const tenantId = body.tenantId ?? "TR";
    const createdBy = body.createdBy ?? "admin";

    await client.query("BEGIN");

    // Nummer atomar vergeben
    const seq = await client.query("SELECT nextval('public.order_number_seq') AS order_number");
    const orderNumber: number = seq.rows[0].order_number;

    // Insert mit allen Feldern
    const sql = `
      INSERT INTO public.orders (
        order_number, status, shipper, pickup_date, dropoff_date,
        from_zip, to_zip, price_customer, price_carrier, ldm, weight_kg,
        remark, carrier, tenant_id, created_by
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
      )
      RETURNING *;
    `;

    const params = [
      orderNumber,
      status,
      body.shipper ?? null,
      body.pickup_date ?? null,
      body.dropoff_date ?? null,
      body.from_zip ?? null,
      body.to_zip ?? null,
      body.price_customer ?? null,
      body.price_carrier ?? null,
      body.ldm ?? null,
      body.weight_kg ?? null,
      body.remark ?? null,
      body.carrier ?? null,
      tenantId,
      createdBy,
    ];

    const { rows } = await client.query<OrderRow>(sql, params);
    await client.query("COMMIT");

    return NextResponse.json({ ok: true, order: rows[0] }, { status: 201 });
  } catch (e: any) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    console.error("POST /api/orders Fehler:", e);
    return NextResponse.json({ error: "Serverfehler beim Speichern" }, { status: 500 });
  } finally {
    client.release();
  }
}

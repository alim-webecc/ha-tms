// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
// vier Ebenen hoch bis Projektroot:
import { pg } from "../../../../lib/db";

// Felder, die per PUT geändert werden dürfen
const UPDATABLE = new Set([
  "status",
  "remark",
  "title",
  "shipper",
  "pickup_date",
  "dropoff_date",
  "from_zip",
  "to_zip",
  "price_customer",
  "price_carrier",
  "ldm",
  "weight_kg",
  "carrier",
]);

// GET /api/orders/:id -> Einzelauftrag
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const idNum = Number(params.id);
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }
  try {
    const { rows } = await pg.query(
      `SELECT *
         FROM public.orders
        WHERE id = $1`,
      [idNum]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (err) {
    console.error("GET /api/orders/:id", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// PUT /api/orders/:id -> Teil-Update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  let payload: Record<string, any>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiges JSON" }, { status: 400 });
  }

  // Nur erlaubte Felder übernehmen
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(payload)) {
    if (UPDATABLE.has(k)) {
      fields.push(`${k} = $${idx++}`);
      values.push(v);
    }
  }
  if (fields.length === 0) {
    return NextResponse.json({ error: "Keine gültigen Felder" }, { status: 400 });
  }
  values.push(idNum); // WHERE

  try {
    const { rows } = await pg.query(
      `UPDATE public.orders
          SET ${fields.join(", ")}, updated_at = now()
        WHERE id = $${idx}
      RETURNING *`,
      values
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (err) {
    console.error("PUT /api/orders/:id", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// DELETE /api/orders/:id -> Soft-Delete (Status "gelöscht")
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const idNum = Number(params.id);
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  // Optional: Remark aus Body übernehmen (für Löschgrund)
  let remark: string | null = null;
  try {
    const body = await req.json().catch(() => null);
    if (body && typeof body.remark === "string") {
      remark = body.remark;
    }
  } catch {
    /* ignore parse errors -> remark bleibt null */
  }

  try {
    const { rows } = await pg.query(
      `UPDATE public.orders
          SET status = 'gelöscht',
              remark = COALESCE($1, remark),
              updated_at = now()
        WHERE id = $2
      RETURNING *`,
      [remark, idNum]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (err) {
    console.error("DELETE /api/orders/:id", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

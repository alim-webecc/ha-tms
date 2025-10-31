// app/api/orders/[id]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";

function getIdFromContext(context: any): number | null {
  const raw = Array.isArray(context?.params?.id)
    ? context.params.id[0]
    : context?.params?.id;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

// GET /api/orders/:id
export async function GET(_req: Request, context: any) {
  const id = getIdFromContext(context);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const pg = getPool();
  try {
    const { rows } = await pg.query(
      "SELECT * FROM public.orders WHERE id = $1",
      [id]
    );
    if (!rows[0]) return NextResponse.json({ ok: true, item: null }, { status: 200 });
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    console.error("GET /orders/:id", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// PUT /api/orders/:id  (nur status/remark updaten)
export async function PUT(req: Request, context: any) {
  const id = getIdFromContext(context);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as Partial<{
    status: string; remark: string;
  }>;
  if (!body) return NextResponse.json({ error: "Ungültiges JSON" }, { status: 400 });

  const pg = getPool();
  try {
    const { rows } = await pg.query(
      `UPDATE public.orders
         SET status = COALESCE($2, status),
             remark = COALESCE($3, remark),
             updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, body.status ?? null, body.remark ?? null]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    console.error("PUT /orders/:id", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// DELETE /api/orders/:id  (soft delete)
export async function DELETE(req: Request, context: any) {
  const id = getIdFromContext(context);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = (await req.json().catch(() => ({}))) as { remark?: string };

  const pg = getPool();
  try {
    const { rows } = await pg.query(
      `UPDATE public.orders
         SET status='gelöscht',
             remark = COALESCE($2, remark),
             updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, body.remark ?? null]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    console.error("DELETE /orders/:id", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

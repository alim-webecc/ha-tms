// app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import { pg } from '../../../../lib/db';

export const runtime = 'nodejs';

type Ctx = { params: { id: string } };

// GET /api/orders/:id
export async function GET(_req: Request, { params }: Ctx) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const client = await pg.connect();
  try {
    const { rows } = await client.query('SELECT * FROM public.orders WHERE id = $1', [id]);
    if (!rows[0]) return NextResponse.json({ ok: true, item: null }, { status: 200 });
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    console.error('GET /orders/:id', e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// PUT /api/orders/:id
export async function PUT(req: Request, { params }: Ctx) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json().catch(() => null) as Partial<{
    status: string; title: string; remark: string;
  }>;
  if (!body) return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 });

  const client = await pg.connect();
  try {
    const { rows } = await client.query(
      `UPDATE public.orders
         SET status = COALESCE($2, status),
             title  = COALESCE($3, title),
             remark = COALESCE($4, remark),
             updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, body.status ?? null, body.title ?? null, body.remark ?? null]
    );
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    console.error('PUT /orders/:id', e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// DELETE /api/orders/:id  (soft delete)
export async function DELETE(req: Request, { params }: Ctx) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json().catch(() => ({})) as { remark?: string };

  const client = await pg.connect();
  try {
    const { rows } = await client.query(
      `UPDATE public.orders
         SET status='gelöscht',
             remark = COALESCE($2, remark),
             updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, body.remark ?? null]
    );
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    console.error('DELETE /orders/:id', e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  } finally {
    client.release();
  }
}

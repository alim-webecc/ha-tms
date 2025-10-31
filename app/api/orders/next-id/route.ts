// app/api/orders/next-id/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
// relativer Import, damit es ohne Pfad-Alias klappt:
import { getPool } from "../../../../lib/db";

export async function GET() {
  try {
    const pg = getPool();
    const { rows } = await pg.query(
      "SELECT nextval('public.order_number_seq') AS id"
    );
    const id: number | undefined = rows[0]?.id;
    if (!id && id !== 0) {
      return NextResponse.json(
        { error: "Keine Auftragsnummer erhalten" },
        { status: 500 }
      );
    }
    return NextResponse.json({ id }, { status: 200 });
  } catch (err) {
    console.error("Fehler /api/orders/next-id:", err);
    return NextResponse.json(
      { error: "Fehler beim Generieren der Auftragsnummer" },
      { status: 500 }
    );
  }
}

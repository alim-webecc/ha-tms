// app/api/orders/next-id/route.ts
import { NextResponse } from 'next/server';
// relativer Import, damit es ohne Pfad-Alias klappt:
import { pg } from '../../../../lib/db';

export async function GET() {
  try {
    const client = await pg.connect();
    try {
      // Holt atomar die nächste Zahl aus der Sequenz
      const { rows } = await client.query(
        "SELECT nextval('public.order_number_seq') AS id"
      );
      const id: number | undefined = rows[0]?.id;
      if (!id && id !== 0) {
        return NextResponse.json(
          { error: 'Keine Auftragsnummer erhalten' },
          { status: 500 }
        );
      }
      // JSON-Antwort
      return NextResponse.json({ id }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Fehler /api/orders/next-id:', err);
    return NextResponse.json(
      { error: 'Fehler beim Generieren der Auftragsnummer' },
      { status: 500 }
    );
  }
}

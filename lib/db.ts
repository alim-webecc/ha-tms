// lib/db.ts
import { Pool } from "pg";

let _pool: Pool | null = null;

/**
 * Initialisiert den Pool erst beim ersten Aufruf.
 * Wirf nur dann, wenn tatsächlich eine DB-Operation benötigt wird.
 * So crasht der Docker-Build nicht, wenn DATABASE_URL zur Build-Zeit fehlt.
 */
export function getPool(): Pool {
  if (_pool) return _pool;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL ist nicht gesetzt (env)!");
  }

  _pool = new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30_000,
  });

  return _pool;
}

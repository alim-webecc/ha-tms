// lib/db.ts
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ist nicht gesetzt (env)!');
}

// globaler Pool (verhindert Mehrfach-Pools bei HMR in Next.js)
const globalForPg = global as unknown as { pgPool?: Pool };

export const pg =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Falls dein Server TLS erfordert, schalte es so ein:
    // ssl: { rejectUnauthorized: false },
  });

if (!globalForPg.pgPool) globalForPg.pgPool = pg;

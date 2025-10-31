// lib/db.ts
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ist nicht gesetzt (env)!');
}

// Globales Pool-Singleton (verhindert mehrere Pools bei HMR/Dev)
declare global {
  // eslint-disable-next-line no-var
  var __pgPool__: Pool | undefined;
}

const pool =
  globalThis.__pgPool__ ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pgPool__ = pool;
}

export const pg = pool;

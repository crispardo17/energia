import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { attachDatabasePool } from '@vercel/functions';
let pool;
export function normalize(value='') { return value.trim().replace(/^['"]|['"]$/g,'').replace(/\\n$/,''); }
export function getPool() {
 if(!pool) {
  const connectionString=normalize(process.env.DATABASE_URL);
  if(!connectionString.startsWith('postgresql://')&&!connectionString.startsWith('postgres://')) throw new Error('Database configuration unavailable');
  pool=new pg.Pool({connectionString,max:4,connectionTimeoutMillis:10000,idleTimeoutMillis:10000});
  attachDatabasePool(pool);
 }
 return pool;
}
export function database() { return drizzle(getPool()); }

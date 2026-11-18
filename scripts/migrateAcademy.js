import { config } from 'dotenv';
import fs from 'node:fs';
import pg from 'pg';
import { normalize } from '../server/db.js';
config({path:process.env.ACADEMY_ENV_FILE||'.env.local',quiet:true});
const pool=new pg.Pool({connectionString:normalize(process.env.DATABASE_URL),max:1,connectionTimeoutMillis:10000});
try {
 await pool.query('BEGIN');
 await pool.query(fs.readFileSync(new URL('../migrations/001_academy.sql',import.meta.url),'utf8'));
 await pool.query('COMMIT');
 console.log('Academy schema ready. Existing application tables were preserved.');
} catch(error) {await pool.query('ROLLBACK');console.error('Migration failed:',error.code||error.name);process.exitCode=1;} finally {await pool.end();}

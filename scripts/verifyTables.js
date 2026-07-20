import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDatabaseUrl() {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (match) return match[1].trim();
    return process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
  } catch (error) {
    return null;
  }
}

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  console.error("❌ No se encontró DATABASE_URL");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function verifyTables() {
  try {
    console.log("📊 Verificando tablas...");

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    console.log("📋 Tablas encontradas:");
    tables.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    // Verificar datos en apartamentos
    const aptos = await sql`SELECT * FROM apartamentos`;
    console.log("📋 Datos en apartamentos:");
    aptos.forEach((row) => {
      console.log(`   - ${row.apto}: ${row.ultima_lectura}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

verifyTables();

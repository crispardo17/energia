import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para leer .env.local manualmente
function getDatabaseUrl() {
  try {
    // Intentar leer .env.local
    const envPath = path.join(__dirname, "..", ".env.local");
    const envContent = fs.readFileSync(envPath, "utf8");

    // Buscar la línea DATABASE_URL
    const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (match) {
      return match[1].trim();
    }

    // Si no, intentar con .env
    const envPath2 = path.join(__dirname, "..", ".env");
    if (fs.existsSync(envPath2)) {
      const envContent2 = fs.readFileSync(envPath2, "utf8");
      const match2 = envContent2.match(/DATABASE_URL="?([^"\n]+)"?/);
      if (match2) {
        return match2[1].trim();
      }
    }

    // Si nada funciona, usar la variable de entorno
    return process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
  } catch (error) {
    console.error("❌ No se pudo leer .env.local:", error.message);
    return null;
  }
}

// Obtener la URL
const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  console.error("❌ Error: No se encontró DATABASE_URL en .env.local");
  console.log("💡 Asegúrate de tener el archivo .env.local con:");
  console.log('   DATABASE_URL="postgresql://..."');
  console.log("💡 O ejecuta: vercel env pull .env.local");
  process.exit(1);
}

console.log("✅ Conexión a Neon establecida");

const sql = neon(databaseUrl);

async function createTables() {
  try {
    console.log("📥 Creando tablas en Neon...");

    // 1. Tabla de apartamentos
    await sql`
      CREATE TABLE IF NOT EXISTS apartamentos (
        apto VARCHAR(10) PRIMARY KEY,
        ultima_lectura INTEGER NOT NULL,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tabla "apartamentos" creada');

    // 2. Tabla de historial
    await sql`
      CREATE TABLE IF NOT EXISTS historial (
        id BIGINT PRIMARY KEY,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        total_general DECIMAL(10,2) NOT NULL,
        datos_completos JSONB NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tabla "historial" creada');

    // 3. Tabla de configuración
    await sql`
      CREATE TABLE IF NOT EXISTS configuracion (
        clave VARCHAR(50) PRIMARY KEY,
        valor TEXT NOT NULL
      );
    `;
    console.log('✅ Tabla "configuracion" creada');

    // 4. Insertar datos iniciales de apartamentos
    await sql`
      INSERT INTO apartamentos (apto, ultima_lectura) VALUES
        ('202', 145656),
        ('203', 137462),
        ('301', 183709),
        ('302', 167209)
      ON CONFLICT (apto) DO NOTHING;
    `;
    console.log("✅ Datos iniciales de apartamentos insertados");

    console.log("🎉 Todas las tablas creadas correctamente");
  } catch (error) {
    console.error("❌ Error al crear tablas:", error);
  }
}

createTables();

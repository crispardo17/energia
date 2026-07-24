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

async function createUsersTable() {
  try {
    console.log("📥 Creando tabla de usuarios...");

    // 1. Crear tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        rol VARCHAR(20) DEFAULT 'usuario',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tabla "usuarios" creada');

    // 2. Insertar usuario administrador por defecto
    // NOTA: En producción, la contraseña debería estar hasheada con bcrypt
    // Para este ejemplo, la guardamos en texto plano (mejorable)
    await sql`
      INSERT INTO usuarios (usuario, contrasena, rol)
      VALUES ('admin', 'kore2026', 'admin')
      ON CONFLICT (usuario) DO NOTHING;
    `;
    console.log("✅ Usuario administrador creado (admin / kore2026)");

    // 3. Verificar
    const users = await sql`SELECT id, usuario, rol FROM usuarios`;
    console.log("📋 Usuarios registrados:");
    users.forEach((row) => {
      console.log(`   - ${row.usuario} (${row.rol})`);
    });

    console.log("🎉 Tabla de usuarios lista!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createUsersTable();

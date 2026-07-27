import { neon } from "@neondatabase/serverless";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LA MISMA CLAVE QUE EN EL CLIENTE
const HASH_SECRET = "kore_secret_hash_key_2026";

function hashPassword(password) {
  return crypto
    .createHmac("sha256", HASH_SECRET)
    .update(password)
    .digest("hex");
}

function getDatabaseUrl() {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (match) return match[1].trim();
    return process.env.DATABASE_URL;
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

async function fixAdmin() {
  try {
    console.log("🔑 Clave de hash:", HASH_SECRET);

    // Generar el hash correcto
    const hashedPassword = hashPassword("kore2026");
    console.log("📝 Hash generado:", hashedPassword);
    console.log("📏 Longitud:", hashedPassword.length);

    // Actualizar el usuario admin
    await sql`
      UPDATE usuarios 
      SET contrasena = ${hashedPassword} 
      WHERE usuario = 'admin'
    `;

    console.log("✅ Contraseña de admin actualizada");

    // Verificar
    const result = await sql`
      SELECT usuario, contrasena FROM usuarios WHERE usuario = 'admin'
    `;

    console.log("📊 Verificación:");
    console.log("   Usuario:", result[0]?.usuario);
    console.log("   Hash en BD:", result[0]?.contrasena);
    console.log("   Coincide:", result[0]?.contrasena === hashedPassword);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fixAdmin();

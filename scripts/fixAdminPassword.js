import { neon } from "@neondatabase/serverless";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HASH_SECRET = "kore_secret_hash_key_2026";

function hashPassword(password) {
  console.log("🔑 Hasheando:", password);
  const hash = crypto
    .createHmac("sha256", HASH_SECRET)
    .update(password)
    .digest("hex");
  console.log("🔑 Hash resultante:", hash);
  console.log("🔑 Longitud:", hash.length);
  return hash;
}

function getDatabaseUrl() {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    console.log("📂 Buscando .env.local en:", envPath);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
      if (match) {
        console.log("✅ DATABASE_URL encontrada en .env.local");
        return match[1].trim();
      }
    }
    console.log("⚠️ No se encontró .env.local, usando variable de entorno");
    return process.env.DATABASE_URL;
  } catch (error) {
    console.error("❌ Error leyendo .env.local:", error);
    return null;
  }
}

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  console.error("❌ No se encontró DATABASE_URL");
  process.exit(1);
}

console.log("📊 Conectando a Neon...");
const sql = neon(databaseUrl);

async function fixAdmin() {
  try {
    console.log("========================================");
    console.log("🔧 Iniciando fixAdmin...");
    console.log("========================================");
    console.log("🔑 Clave de hash:", HASH_SECRET);

    // Generar el hash correcto
    const hashedPassword = hashPassword("kore2026");
    console.log("📝 Hash generado (completo):", hashedPassword);
    console.log("📏 Longitud:", hashedPassword.length);

    // Verificar si existe el usuario admin
    console.log("🔄 Verificando usuario admin...");
    const adminCheck = await sql`
      SELECT usuario, contrasena FROM usuarios WHERE usuario = 'admin'
    `;

    console.log("📊 Admin encontrado:", adminCheck.length > 0);

    if (adminCheck.length === 0) {
      console.log("🆕 Creando usuario admin...");
      await sql`
        INSERT INTO usuarios (usuario, contrasena, rol)
        VALUES ('admin', ${hashedPassword}, 'admin')
      `;
      console.log("✅ Usuario admin creado");
    } else {
      console.log("📊 Hash actual del admin:", adminCheck[0].contrasena);
      console.log(
        "📊 Hash actual (primeros 20):",
        adminCheck[0].contrasena?.substring(0, 20) + "...",
      );

      // Actualizar el usuario admin
      console.log("🔄 Actualizando usuario admin...");
      await sql`
        UPDATE usuarios 
        SET contrasena = ${hashedPassword} 
        WHERE usuario = 'admin'
      `;
      console.log("✅ Contraseña de admin actualizada");
    }

    // Verificar el hash final
    console.log("🔄 Verificando hash final...");
    const result = await sql`
      SELECT usuario, contrasena FROM usuarios WHERE usuario = 'admin'
    `;

    console.log("📊 Verificación final:");
    console.log("   Usuario:", result[0]?.usuario);
    console.log("   Hash en BD (completo):", result[0]?.contrasena);
    console.log(
      "   Hash en BD (primeros 20):",
      result[0]?.contrasena?.substring(0, 20) + "...",
    );
    console.log(
      "   Coincide con el hash generado:",
      result[0]?.contrasena === hashedPassword,
    );
    console.log("========================================");
    console.log("✅ ¡Proceso completado!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fixAdmin();

import { neon } from "@neondatabase/serverless";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function updateUsers() {
  try {
    console.log("📥 Actualizando usuarios con contraseñas hasheadas...");

    const users = await sql`SELECT id, usuario, contrasena FROM usuarios`;

    for (const user of users) {
      // Si la contraseña no es un hash SHA-256 (64 caracteres hex)
      if (!/^[a-f0-9]{64}$/.test(user.contrasena)) {
        const hashedPassword = hashPassword(user.contrasena);
        await sql`
          UPDATE usuarios 
          SET contrasena = ${hashedPassword} 
          WHERE id = ${user.id}
        `;
        console.log(`✅ Contraseña actualizada para: ${user.usuario}`);
        console.log(`   Hash: ${hashedPassword.substring(0, 20)}...`);
      } else {
        console.log(`⏭️ ${user.usuario} ya tiene contraseña hasheada`);
      }
    }

    console.log("🎉 Usuarios actualizados correctamente");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

updateUsers();

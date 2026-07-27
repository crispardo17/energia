import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
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

    // Obtener todos los usuarios
    const users = await sql`SELECT id, usuario, contrasena FROM usuarios`;

    for (const user of users) {
      // Si la contraseña no está hasheada
      if (
        !user.contrasena.startsWith("$2a$") &&
        !user.contrasena.startsWith("$2b$")
      ) {
        const hashedPassword = await bcrypt.hash(user.contrasena, 10);
        await sql`
          UPDATE usuarios 
          SET contrasena = ${hashedPassword} 
          WHERE id = ${user.id}
        `;
        console.log(`✅ Contraseña actualizada para: ${user.usuario}`);
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

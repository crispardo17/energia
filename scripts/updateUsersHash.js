import { neon } from "@neondatabase/serverless";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LA MISMA CLAVE QUE EN EL CLIENTE Y LA API
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
    console.log(
      "📥 Actualizando usuarios con contraseñas hasheadas (SHA-256)...",
    );
    console.log("🔑 Clave de hash:", HASH_SECRET);

    const users = await sql`SELECT id, usuario, contrasena FROM usuarios`;

    if (users.length === 0) {
      console.log(
        "⚠️ No hay usuarios en la base de datos. Creando usuario admin...",
      );
      const hashedPassword = hashPassword("kore2026");
      await sql`
        INSERT INTO usuarios (usuario, contrasena, rol)
        VALUES ('admin', ${hashedPassword}, 'admin')
        ON CONFLICT (usuario) DO NOTHING;
      `;
      console.log("✅ Usuario admin creado con contraseña: kore2026");
      console.log(`   Hash: ${hashedPassword.substring(0, 20)}...`);
    }

    for (const user of users) {
      // Si la contraseña NO es un hash SHA-256 (64 caracteres hex)
      // O si es un hash de bcrypt (empieza con $2a$ o $2b$)
      if (
        !/^[a-f0-9]{64}$/.test(user.contrasena) ||
        user.contrasena.startsWith("$2a") ||
        user.contrasena.startsWith("$2b")
      ) {
        const hashedPassword = hashPassword(user.contrasena);
        await sql`
          UPDATE usuarios 
          SET contrasena = ${hashedPassword} 
          WHERE id = ${user.id}
        `;
        console.log(`✅ Contraseña actualizada para: ${user.usuario}`);
        console.log(`   Nuevo hash: ${hashedPassword.substring(0, 20)}...`);
      } else {
        console.log(
          `⏭️ ${user.usuario} ya tiene contraseña hasheada con SHA-256`,
        );
        console.log(`   Hash: ${user.contrasena.substring(0, 20)}...`);
      }
    }

    // Verificar que el admin existe
    const adminCheck =
      await sql`SELECT usuario, contrasena FROM usuarios WHERE usuario = 'admin'`;
    if (adminCheck.length === 0) {
      const hashedPassword = hashPassword("kore2026");
      await sql`
        INSERT INTO usuarios (usuario, contrasena, rol)
        VALUES ('admin', ${hashedPassword}, 'admin')
      `;
      console.log("✅ Usuario admin creado con contraseña: kore2026");
    }

    console.log("🎉 Usuarios actualizados correctamente");

    // Mostrar usuarios
    const finalUsers = await sql`SELECT id, usuario, rol FROM usuarios`;
    console.log("📋 Usuarios en la base de datos:");
    finalUsers.forEach((row) => {
      console.log(`   - ${row.usuario} (${row.rol})`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

updateUsers();

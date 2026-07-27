import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || "kore_secret_key_2026";
const HASH_SECRET = process.env.HASH_SECRET || "kore_secret_hash_key_2026";

// Función para hashear en el servidor (misma que en el cliente)
function hashPassword(password) {
  const hash = crypto
    .createHmac("sha256", HASH_SECRET)
    .update(password)
    .digest("hex");
  console.log("🔑 hashPassword() - Input:", password?.substring(0, 10) + "...");
  console.log("🔑 hashPassword() - Output:", hash.substring(0, 20) + "...");
  console.log("🔑 hashPassword() - Longitud:", hash.length);
  return hash;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  console.log("========================================");
  console.log("📡 API /auth - Método:", req.method);
  console.log("========================================");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // POST: Login
    if (req.method === "POST") {
      const { usuario, contrasena } = req.body;

      console.log("📥 Login intent:");
      console.log("   Usuario:", usuario);
      console.log(
        "   Contraseña (primeros 20 chars):",
        contrasena?.substring(0, 20) + "...",
      );
      console.log("   Contraseña (longitud):", contrasena?.length);

      if (!usuario || !contrasena) {
        console.log("❌ Error: Usuario o contraseña vacíos");
        return res.status(400).json({
          success: false,
          error: "Usuario y contraseña son requeridos",
        });
      }

      console.log("🔄 Buscando usuario en la base de datos...");

      // Buscar usuario en la base de datos
      const result = await sql`
        SELECT id, usuario, contrasena, rol 
        FROM usuarios 
        WHERE usuario = ${usuario}
      `;

      console.log("📊 Resultado de búsqueda:");
      console.log("   Registros encontrados:", result.length);

      if (result.length === 0) {
        console.log("❌ Usuario no encontrado:", usuario);
        return res.status(401).json({
          success: false,
          error: "Usuario no encontrado",
        });
      }

      const user = result[0];
      console.log("👤 Usuario encontrado:");
      console.log("   ID:", user.id);
      console.log("   Usuario:", user.usuario);
      console.log("   Rol:", user.rol);
      console.log(
        "   Hash en BD (primeros 20 chars):",
        user.contrasena?.substring(0, 20) + "...",
      );
      console.log("   Hash en BD (longitud):", user.contrasena?.length);
      console.log(
        "   ¿Es hash SHA-256 (64 chars)?",
        /^[a-f0-9]{64}$/.test(user.contrasena),
      );

      // Hashear la contraseña recibida para comparar
      console.log("🔄 Hasheando contraseña recibida...");
      const hashedInputPassword = hashPassword(contrasena);
      console.log("🔐 Hash calculado (completo):", hashedInputPassword);
      console.log(
        "🔐 Hash calculado (primeros 20):",
        hashedInputPassword.substring(0, 20) + "...",
      );
      console.log("🔐 Hash en BD (completo):", user.contrasena);
      console.log(
        "🔐 Hash en BD (primeros 20):",
        user.contrasena?.substring(0, 20) + "...",
      );

      console.log("🔐 Comparando hashes:");
      console.log(
        "   ¿Coinciden exactamente?",
        user.contrasena === hashedInputPassword,
      );
      console.log(
        "   ¿Coinciden los primeros 10?",
        user.contrasena?.substring(0, 10) ===
          hashedInputPassword.substring(0, 10),
      );

      // Comparar directamente (ambos son hashes SHA-256 con la misma clave)
      const passwordMatch = user.contrasena === hashedInputPassword;

      console.log("🔐 Resultado de la comparación:", passwordMatch);

      if (!passwordMatch) {
        console.log("❌ Contraseña incorrecta");
        console.log("========================================");
        return res.status(401).json({
          success: false,
          error: "Contraseña incorrecta",
        });
      }

      console.log("✅ Login exitoso para:", usuario);

      // Generar JWT Token
      console.log("🔄 Generando JWT token...");
      const token = jwt.sign(
        {
          id: user.id,
          usuario: user.usuario,
          rol: user.rol,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );
      console.log("✅ Token generado:", token.substring(0, 30) + "...");

      // Login exitoso
      console.log("========================================");
      return res.status(200).json({
        success: true,
        token,
        usuario: user.usuario,
        rol: user.rol,
        expira: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // GET: Verificar token
    if (req.method === "GET") {
      console.log("🔄 Verificando token...");
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ Token no proporcionado");
        console.log("========================================");
        return res.status(401).json({
          success: false,
          error: "Token no proporcionado",
        });
      }

      const token = authHeader.split(" ")[1];
      console.log("🔐 Token recibido:", token.substring(0, 30) + "...");

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token válido para:", decoded.usuario);
        console.log("========================================");
        return res.status(200).json({
          success: true,
          usuario: decoded.usuario,
          rol: decoded.rol,
          expira: new Date(decoded.exp * 1000).toISOString(),
        });
      } catch (error) {
        console.log("❌ Token inválido:", error.message);
        console.log("========================================");
        return res.status(401).json({
          success: false,
          error: "Token inválido o expirado",
        });
      }
    }

    console.log("❌ Método no permitido:", req.method);
    console.log("========================================");
    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error en auth API:", error);
    console.log("========================================");
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor: " + error.message,
    });
  }
}

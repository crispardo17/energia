import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || "kore_secret_key_2026";
const HASH_SECRET = process.env.HASH_SECRET || "kore_secret_hash_key_2026";

// Función para hashear en el servidor (misma que en el cliente)
function hashPassword(password) {
  return crypto
    .createHmac("sha256", HASH_SECRET)
    .update(password)
    .digest("hex");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // POST: Login
    if (req.method === "POST") {
      const { usuario, contrasena } = req.body;

      console.log("📥 Login intent:", {
        usuario,
        contrasena: contrasena?.substring(0, 20) + "...",
      });

      if (!usuario || !contrasena) {
        return res.status(400).json({
          success: false,
          error: "Usuario y contraseña son requeridos",
        });
      }

      // Buscar usuario en la base de datos
      const result = await sql`
        SELECT id, usuario, contrasena, rol 
        FROM usuarios 
        WHERE usuario = ${usuario}
      `;

      if (result.length === 0) {
        console.log("❌ Usuario no encontrado:", usuario);
        return res.status(401).json({
          success: false,
          error: "Usuario no encontrado",
        });
      }

      const user = result[0];
      console.log("👤 Usuario encontrado:", user.usuario);

      // Hashear la contraseña recibida para comparar
      const hashedInputPassword = hashPassword(contrasena);
      console.log(
        "🔐 Hash recibido:",
        hashedInputPassword.substring(0, 20) + "...",
      );
      console.log("🔐 Hash en BD:", user.contrasena?.substring(0, 20) + "...");

      // Comparar directamente (ambos son hashes SHA-256 con la misma clave)
      const passwordMatch = user.contrasena === hashedInputPassword;

      if (!passwordMatch) {
        console.log("❌ Contraseña incorrecta");
        return res.status(401).json({
          success: false,
          error: "Contraseña incorrecta",
        });
      }

      console.log("✅ Login exitoso para:", usuario);

      // Generar JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          usuario: user.usuario,
          rol: user.rol,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      // Login exitoso
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
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          error: "Token no proporcionado",
        });
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({
          success: true,
          usuario: decoded.usuario,
          rol: decoded.rol,
          expira: new Date(decoded.exp * 1000).toISOString(),
        });
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: "Token inválido o expirado",
        });
      }
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("Error en auth API:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
}

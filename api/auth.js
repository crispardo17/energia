import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL);

// FORZAR LA MISMA CLAVE QUE EN EL CLIENTE
const HASH_SECRET = "kore_secret_hash_key_2026";
const JWT_SECRET = "kore_secret_key_2026";

// Función para hashear
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

  // POST: Login
  if (req.method === "POST") {
    try {
      // 1. Obtener el body
      const body = req.body;
      console.log("========================================");
      console.log("📥 BODY RECIBIDO:", JSON.stringify(body, null, 2));

      // 2. Extraer campos (soporta ambos nombres)
      const usuario = body.usuario || body.user;
      const contrasena = body.contrasena || body.contraseña || body.password;

      console.log("📊 DATOS EXTRACTADOS:");
      console.log("   Usuario:", usuario);
      console.log(
        "   Contraseña (primeros 20):",
        contrasena?.substring(0, 20) + "...",
      );
      console.log("   Contraseña (longitud):", contrasena?.length);

      if (!usuario || !contrasena) {
        console.log("❌ Error: Campos vacíos");
        return res.status(400).json({
          success: false,
          error: "Usuario y contraseña son requeridos",
          debug: { usuario: !!usuario, contrasena: !!contrasena },
        });
      }

      // 3. Buscar usuario en la base de datos
      console.log("🔄 Buscando usuario en la base de datos...");
      const result = await sql`
        SELECT id, usuario, contrasena, rol 
        FROM usuarios 
        WHERE usuario = ${usuario}
      `;

      if (result.length === 0) {
        console.log("❌ Usuario no encontrado:", usuario);
        return res.status(401).json({
          success: false,
          error: "Credenciales incorrectas",
          debug: { usuario: usuario, encontrado: false },
        });
      }

      const user = result[0];
      console.log("👤 Usuario encontrado:");
      console.log("   ID:", user.id);
      console.log("   Usuario:", user.usuario);
      console.log("   Rol:", user.rol);
      console.log("   Hash en BD:", user.contrasena);
      console.log(
        "   Hash en BD (primeros 20):",
        user.contrasena?.substring(0, 20) + "...",
      );

      // 4. Hashear la contraseña recibida
      console.log("🔄 Hasheando contraseña recibida...");
      const hashedInputPassword = hashPassword(contrasena);
      console.log("🔐 Hash calculado:", hashedInputPassword);
      console.log(
        "🔐 Hash calculado (primeros 20):",
        hashedInputPassword.substring(0, 20) + "...",
      );

      // 5. Comparar
      const passwordMatch = user.contrasena === hashedInputPassword;
      console.log("🔐 Comparación:");
      console.log("   ¿Coinciden?", passwordMatch);
      console.log("   Hash BD completo:", user.contrasena);
      console.log("   Hash input completo:", hashedInputPassword);

      if (!passwordMatch) {
        console.log("❌ Contraseña incorrecta");
        console.log("========================================");
        return res.status(401).json({
          success: false,
          error: "Contraseña incorrecta",
          debug: {
            usuario: usuario,
            hash_bd: user.contrasena.substring(0, 20) + "...",
            hash_input: hashedInputPassword.substring(0, 20) + "...",
          },
        });
      }

      console.log("✅ Login exitoso para:", usuario);

      // 6. Generar JWT
      const token = jwt.sign(
        { id: user.id, usuario: user.usuario, rol: user.rol },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      console.log("========================================");
      return res.status(200).json({
        success: true,
        token,
        usuario: user.usuario,
        rol: user.rol,
        expira: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (error) {
      console.error("❌ Error en POST /auth:", error);
      return res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        debug: { message: error.message },
      });
    }
  }

  // GET: Verificar token
  if (req.method === "GET") {
    try {
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
    } catch (error) {
      console.error("❌ Error en GET /auth:", error);
      return res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

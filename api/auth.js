import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // GET: Verificar sesión
    if (req.method === "GET") {
      // Solo para verificar que la API funciona
      return res.status(200).json({
        success: true,
        message: "API de autenticación funcionando",
      });
    }

    // POST: Login
    if (req.method === "POST") {
      const { usuario, contrasena } = req.body;

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
        return res.status(401).json({
          success: false,
          error: "Usuario no encontrado",
        });
      }

      const user = result[0];

      // Verificar contraseña (en texto plano por ahora)
      if (user.contrasena !== contrasena) {
        return res.status(401).json({
          success: false,
          error: "Contraseña incorrecta",
        });
      }

      // Login exitoso
      return res.status(200).json({
        success: true,
        usuario: user.usuario,
        rol: user.rol,
        mensaje: "Inicio de sesión exitoso",
      });
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

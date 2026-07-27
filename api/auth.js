import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = "kore_secret_key_2026";
const HASH_SECRET = "kore_secret_hash_key_2026";

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

  if (req.method === "POST") {
    try {
      const { usuario, contrasena } = req.body;

      console.log("📥 Login:", {
        usuario,
        contrasena: contrasena?.substring(0, 20) + "...",
      });

      if (!usuario || !contrasena) {
        return res
          .status(400)
          .json({ success: false, error: "Campos requeridos" });
      }

      // Buscar usuario
      const result = await sql`
        SELECT id, usuario, contrasena, rol FROM usuarios WHERE usuario = ${usuario}
      `;

      if (result.length === 0) {
        return res
          .status(401)
          .json({ success: false, error: "Credenciales incorrectas" });
      }

      const user = result[0];

      // Hashear la contraseña recibida
      const hashedInput = hashPassword(contrasena);
      console.log("🔐 Hash input:", hashedInput);
      console.log("🔐 Hash BD:", user.contrasena);

      // Comparar
      const passwordMatch = user.contrasena === hashedInput;

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ success: false, error: "Credenciales incorrectas" });
      }

      // Generar token
      const token = jwt.sign(
        { id: user.id, usuario: user.usuario, rol: user.rol },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      return res.status(200).json({
        success: true,
        token,
        usuario: user.usuario,
        rol: user.rol,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ success: false, error: "Error interno" });
    }
  }

  if (req.method === "GET") {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, error: "Token no proporcionado" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.status(200).json({
        success: true,
        usuario: decoded.usuario,
        rol: decoded.rol,
      });
    } catch (error) {
      return res.status(401).json({ success: false, error: "Token inválido" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

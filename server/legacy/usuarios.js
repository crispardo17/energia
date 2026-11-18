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

// Verificar token de administrador
async function verificarAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token no proporcionado" };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.rol !== "admin") {
      return { error: "Permisos insuficientes" };
    }
    return { user: decoded };
  } catch (error) {
    return { error: "Token inválido" };
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Verificar autenticación y permisos de admin
  const auth = await verificarAdmin(req);
  if (auth.error) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  try {
    // GET: Obtener todos los usuarios
    if (req.method === "GET") {
      const usuarios = await sql`
        SELECT id, usuario, rol, fecha_creacion 
        FROM usuarios 
        ORDER BY id
      `;
      return res.status(200).json({
        success: true,
        usuarios,
      });
    }

    // POST: Crear nuevo usuario
    if (req.method === "POST") {
      const { usuario, contrasena, rol } = req.body;

      if (!usuario || !contrasena) {
        return res.status(400).json({
          success: false,
          error: "Usuario y contraseña son requeridos",
        });
      }

      // Verificar si el usuario ya existe
      const existente = await sql`
        SELECT id FROM usuarios WHERE usuario = ${usuario}
      `;

      if (existente.length > 0) {
        return res.status(400).json({
          success: false,
          error: "El usuario ya existe",
        });
      }

      const hashedPassword = hashPassword(contrasena);
      const nuevoRol = rol || "usuario";

      const result = await sql`
        INSERT INTO usuarios (usuario, contrasena, rol)
        VALUES (${usuario}, ${hashedPassword}, ${nuevoRol})
        RETURNING id, usuario, rol, fecha_creacion
      `;

      return res.status(201).json({
        success: true,
        usuario: result[0],
        message: "Usuario creado correctamente",
      });
    }

    // PUT: Actualizar usuario
    if (req.method === "PUT") {
      const { id, usuario, contrasena, rol } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID de usuario es requerido",
        });
      }

      // Verificar que el usuario existe
      const existente = await sql`
        SELECT id FROM usuarios WHERE id = ${id}
      `;

      if (existente.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
        });
      }

      // Construir la consulta de actualización dinámicamente
      let updates = [];
      let values = [];

      if (usuario) {
        updates.push(`usuario = $${values.length + 1}`);
        values.push(usuario);
      }

      if (contrasena) {
        const hashedPassword = hashPassword(contrasena);
        updates.push(`contrasena = $${values.length + 1}`);
        values.push(hashedPassword);
      }

      if (rol) {
        updates.push(`rol = $${values.length + 1}`);
        values.push(rol);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No hay campos para actualizar",
        });
      }

      values.push(id);
      const query = `
        UPDATE usuarios 
        SET ${updates.join(", ")}, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $${values.length}
        RETURNING id, usuario, rol, fecha_creacion
      `;

      const result = await sql.query(query, values);

      return res.status(200).json({
        success: true,
        usuario: result[0],
        message: "Usuario actualizado correctamente",
      });
    }

    // DELETE: Eliminar usuario
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID de usuario es requerido",
        });
      }

      // Verificar que no sea el admin principal
      const usuario = await sql`
        SELECT usuario, rol FROM usuarios WHERE id = ${id}
      `;

      if (usuario.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
        });
      }

      if (usuario[0].usuario === "admin" && usuario[0].rol === "admin") {
        return res.status(403).json({
          success: false,
          error: "No se puede eliminar el usuario administrador principal",
        });
      }

      await sql`DELETE FROM usuarios WHERE id = ${id}`;

      return res.status(200).json({
        success: true,
        message: "Usuario eliminado correctamente",
      });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("Error en API de usuarios:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
}

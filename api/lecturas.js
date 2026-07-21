import { neon } from "@neondatabase/serverless";

// Obtener la URL de conexión (solo disponible en el servidor)
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // Obtener todas las lecturas
      const apartamentos = await sql`SELECT * FROM apartamentos`;
      const historial =
        await sql`SELECT * FROM historial ORDER BY fecha_inicio DESC`;

      return res.status(200).json({
        success: true,
        apartamentos,
        historial,
      });
    }

    if (req.method === "POST") {
      // Guardar lecturas
      const { apto, lectura, datosCompletos } = req.body;

      if (apto && lectura) {
        await sql`
          INSERT INTO apartamentos (apto, ultima_lectura, fecha_actualizacion)
          VALUES (${apto}, ${lectura}, CURRENT_TIMESTAMP)
          ON CONFLICT (apto) 
          DO UPDATE SET 
            ultima_lectura = ${lectura},
            fecha_actualizacion = CURRENT_TIMESTAMP
        `;
      }

      if (datosCompletos) {
        const id = Date.now();
        await sql`
          INSERT INTO historial (id, fecha_inicio, fecha_fin, total_general, datos_completos)
          VALUES (
            ${id},
            ${datosCompletos.periodo.inicio},
            ${datosCompletos.periodo.fin},
            ${datosCompletos.resumen.totalGeneral},
            ${JSON.stringify(datosCompletos)}
          )
        `;
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("Error en API:", error);
    return res.status(500).json({ error: error.message });
  }
}

import { neon } from "@neondatabase/serverless";

// Usar POSTGRES_URL (que Vercel ya tiene configurada)
const databaseUrl =
  import.meta.env.POSTGRES_URL ||
  import.meta.env.DATABASE_URL ||
  import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ No se encontró POSTGRES_URL ni DATABASE_URL");
  console.log("Variables disponibles:", Object.keys(import.meta.env));
}

console.log("✅ Conectando a Neon...");
const sql = neon(databaseUrl);

// ============================================
// FUNCIONES PARA APARTAMENTOS
// ============================================

export const obtenerTodasLasLecturas = async () => {
  try {
    const result = await sql`
      SELECT apto, ultima_lectura FROM apartamentos
    `;
    const lecturas = {};
    result.forEach((row) => {
      lecturas[row.apto] = row.ultima_lectura;
    });
    return lecturas;
  } catch (error) {
    console.error("Error al obtener lecturas:", error);
    return {};
  }
};

export const guardarLecturaApto = async (apto, lectura) => {
  try {
    await sql`
      INSERT INTO apartamentos (apto, ultima_lectura, fecha_actualizacion)
      VALUES (${apto}, ${lectura}, CURRENT_TIMESTAMP)
      ON CONFLICT (apto) 
      DO UPDATE SET 
        ultima_lectura = ${lectura},
        fecha_actualizacion = CURRENT_TIMESTAMP
    `;
    return { success: true };
  } catch (error) {
    console.error("Error al guardar lectura:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA HISTORIAL
// ============================================

export const obtenerHistorial = async () => {
  try {
    const result = await sql`
      SELECT * FROM historial 
      ORDER BY fecha_inicio DESC
    `;
    return result;
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
};

export const guardarHistorial = async (datos) => {
  try {
    const id = Date.now();
    await sql`
      INSERT INTO historial (id, fecha_inicio, fecha_fin, total_general, datos_completos)
      VALUES (
        ${id},
        ${datos.periodo.inicio},
        ${datos.periodo.fin},
        ${datos.resumen.totalGeneral},
        ${JSON.stringify(datos)}
      )
    `;
    return { success: true, id };
  } catch (error) {
    console.error("Error al guardar historial:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIÓN PARA MIGRAR DATOS INICIALES
// ============================================

export const migrarDatosIniciales = async () => {
  try {
    const datosIniciales = {
      periodo: {
        inicio: "2026-04-18",
        fin: "2026-05-20",
      },
      valorKW: 819.66,
      totalFacturado: 616,
      aseo: 29142,
      aptos: {
        202: { actual: 146436, anterior: 145656 },
        203: { actual: 139462, anterior: 137462 },
        301: { actual: 184805, anterior: 183709 },
        302: { actual: 168707, anterior: 167209 },
      },
      consumos: {
        202: { consumo: 78, valor: 63933.48 },
        203: { consumo: 200, valor: 163932 },
        301: { consumo: 109.6, valor: 89834.74 },
        302: { consumo: 149.8, valor: 122785.07 },
        201: { consumo: 78.6, valor: 64425.28 },
      },
      resumen: {
        datos: [
          {
            apto: "202",
            consumo: 78,
            valorEnergia: 63933.48,
            aseo: 29142,
            total: 93075.48,
          },
          {
            apto: "203",
            consumo: 200,
            valorEnergia: 163932,
            aseo: 29142,
            total: 193074,
          },
          {
            apto: "301",
            consumo: 109.6,
            valorEnergia: 89834.74,
            aseo: 29142,
            total: 118976.74,
          },
          {
            apto: "302",
            consumo: 149.8,
            valorEnergia: 122785.07,
            aseo: 29142,
            total: 151927.07,
          },
          {
            apto: "201",
            consumo: 78.6,
            valorEnergia: 64425.28,
            aseo: 29142,
            total: 93567.28,
          },
        ],
        totalGeneral: 650620.57,
      },
    };

    const result = await guardarHistorial(datosIniciales);
    if (result.success) {
      console.log("✅ Datos iniciales migrados correctamente");
    }
    return result;
  } catch (error) {
    console.error("❌ Error al migrar datos:", error);
    return { success: false, error: error.message };
  }
};

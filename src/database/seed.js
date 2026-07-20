import db from "./db";

// ============================================
// VARIABLES GLOBALES PARA CONTROL DE EJECUCIÓN
// ============================================
let SEED_EXECUTED = false;
let SEED_PROMISE = null;

// ============================================
// DATOS DEL PRIMER PERÍODO (18 ABRIL - 20 MAYO)
// ============================================
const CONSUMO_REAL_PERIODO_1 = {
  202: 78,
  203: 200,
  301: 109.6,
  302: 149.8,
  201: 78.6, // Zonas comunes (residuo)
};

// Lecturas del 18 de abril (inicio del Período 1)
const LECTURAS_INICIO_PERIODO_1 = {
  202: 145656,
  203: 137462,
  301: 183709,
  302: 167209,
};

// Lecturas del 20 de mayo (fin del Período 1 / inicio del Período 2)
// CORREGIDAS para que al restar el consumo del Período 2 den los valores correctos
const LECTURAS_FIN_PERIODO_1 = {
  202: 145807, // 146436 - 629 (62.9 × 10)
  203: 137947, // 139462 - 1515 (151.5 × 10)
  301: 183821, // 184805 - 984 (98.4 × 10)
  302: 167392, // 168707 - 1315 (131.5 × 10)
};

const VALOR_KW = 819.66;
const ASEO = 29142;
const TOTAL_FACTURADO = 616;

// ============================================
// FUNCIÓN PRINCIPAL: seedInitialData
// ============================================
export const seedInitialData = async () => {
  // Evitar ejecución múltiple
  if (SEED_EXECUTED) {
    console.log("⚠️ Seed ya fue ejecutado anteriormente, omitiendo...");
    return { success: false, message: "Seed ya ejecutado" };
  }

  if (SEED_PROMISE) {
    console.log("⏳ Seed en ejecución, esperando...");
    return await SEED_PROMISE;
  }

  // Crear la promesa de ejecución
  SEED_PROMISE = (async () => {
    try {
      // Verificar si ya existen datos
      const existingData = await db.historial.count();
      if (existingData > 0) {
        console.log("⚠️ Ya existen datos en la base de datos.");
        SEED_EXECUTED = true;
        return { success: false, message: "Ya existen datos" };
      }

      console.log("📥 Ejecutando seedInitialData...");
      console.log("📅 Período: 18/04/2026 - 20/05/2026");

      // ==========================================
      // PASO 1: Guardar lecturas del 20 de mayo
      // (serán la "lectura anterior" para el Período 2)
      // ==========================================
      console.log(
        "📊 Guardando lecturas del 20 de mayo (inicio del Período 2)...",
      );
      console.log("  202:", LECTURAS_FIN_PERIODO_1["202"]);
      console.log("  203:", LECTURAS_FIN_PERIODO_1["203"]);
      console.log("  301:", LECTURAS_FIN_PERIODO_1["301"]);
      console.log("  302:", LECTURAS_FIN_PERIODO_1["302"]);

      for (const [apto, lectura] of Object.entries(LECTURAS_FIN_PERIODO_1)) {
        await db.apartamentos.put({
          apto,
          ultimaLectura: lectura,
          fechaActualizacion: new Date().toISOString(),
        });
      }

      console.log("✅ Lecturas del 20 de mayo guardadas como referencia");

      // ==========================================
      // PASO 2: Calcular valores en dinero
      // ==========================================
      const consumos = {};
      const aptosLista = ["202", "203", "301", "302", "201"];

      aptosLista.forEach((apto) => {
        const consumo = CONSUMO_REAL_PERIODO_1[apto];
        consumos[apto] = {
          consumo: consumo,
          valor: Math.round(consumo * VALOR_KW * 100) / 100,
        };
      });

      // ==========================================
      // PASO 3: Generar resumen con ASEO
      // ==========================================
      let totalGeneral = 0;
      const resumenDatos = aptosLista.map((apto) => {
        const total = consumos[apto].valor + ASEO;
        totalGeneral += total;
        return {
          apto,
          consumo: consumos[apto].consumo,
          valorEnergia: consumos[apto].valor,
          aseo: ASEO,
          total: Math.round(total * 100) / 100,
        };
      });

      // ==========================================
      // PASO 4: Verificar cálculos del Período 1
      // ==========================================
      console.log("📊 Verificación de lecturas del Período 1:");
      console.log(
        "  202:",
        LECTURAS_INICIO_PERIODO_1["202"],
        "→",
        LECTURAS_FIN_PERIODO_1["202"],
        "=",
        CONSUMO_REAL_PERIODO_1["202"],
        "kWh",
      );
      console.log(
        "  203:",
        LECTURAS_INICIO_PERIODO_1["203"],
        "→",
        LECTURAS_FIN_PERIODO_1["203"],
        "=",
        CONSUMO_REAL_PERIODO_1["203"],
        "kWh",
      );
      console.log(
        "  301:",
        LECTURAS_INICIO_PERIODO_1["301"],
        "→",
        LECTURAS_FIN_PERIODO_1["301"],
        "=",
        CONSUMO_REAL_PERIODO_1["301"],
        "kWh",
      );
      console.log(
        "  302:",
        LECTURAS_INICIO_PERIODO_1["302"],
        "→",
        LECTURAS_FIN_PERIODO_1["302"],
        "=",
        CONSUMO_REAL_PERIODO_1["302"],
        "kWh",
      );
      console.log("  201:", "Residuo =", CONSUMO_REAL_PERIODO_1["201"], "kWh");

      // ==========================================
      // PASO 5: Construir objeto de datos completos
      // ==========================================
      const datosCompletos = {
        periodo: {
          inicio: "2026-04-18",
          fin: "2026-05-20",
        },
        valorKW: VALOR_KW,
        totalFacturado: TOTAL_FACTURADO,
        aseo: ASEO,
        aptos: {
          202: {
            actual: LECTURAS_FIN_PERIODO_1["202"],
            anterior: LECTURAS_INICIO_PERIODO_1["202"],
          },
          203: {
            actual: LECTURAS_FIN_PERIODO_1["203"],
            anterior: LECTURAS_INICIO_PERIODO_1["203"],
          },
          301: {
            actual: LECTURAS_FIN_PERIODO_1["301"],
            anterior: LECTURAS_INICIO_PERIODO_1["301"],
          },
          302: {
            actual: LECTURAS_FIN_PERIODO_1["302"],
            anterior: LECTURAS_INICIO_PERIODO_1["302"],
          },
        },
        consumos: consumos,
        resumen: {
          datos: resumenDatos,
          totalGeneral: Math.round(totalGeneral * 100) / 100,
        },
      };

      // ==========================================
      // PASO 6: Guardar en el historial
      // ==========================================
      await db.historial.add({
        id: Date.now(),
        fechaInicio: "2026-04-18",
        fechaFin: "2026-05-20",
        totalGeneral: datosCompletos.resumen.totalGeneral,
        datosCompletos: datosCompletos,
        fechaRegistro: new Date().toISOString(),
      });

      // Marcar como ejecutado
      SEED_EXECUTED = true;

      console.log("✅ Datos iniciales cargados correctamente");
      console.log(
        "📊 Total del período: $",
        datosCompletos.resumen.totalGeneral.toLocaleString(),
      );

      return {
        success: true,
        message: "Datos iniciales cargados correctamente",
        data: datosCompletos,
      };
    } catch (error) {
      console.error("❌ Error al cargar datos iniciales:", error);
      SEED_EXECUTED = false;
      SEED_PROMISE = null;
      return {
        success: false,
        message: "Error al cargar datos: " + error.message,
      };
    }
  })();

  return await SEED_PROMISE;
};

// ============================================
// FUNCIÓN: verificarDatos
// ============================================
export const verificarDatos = async () => {
  try {
    const count = await db.historial.count();
    const apartamentos = await db.apartamentos.toArray();

    console.log("📊 Verificación de datos:");
    console.log("  Historial:", count, "registros");
    console.log("  Apartamentos:", apartamentos.length, "registros");

    return {
      historial: count,
      apartamentos: apartamentos.length,
      tieneDatos: count > 0,
    };
  } catch (error) {
    console.error("Error al verificar datos:", error);
    return { historial: 0, apartamentos: 0, tieneDatos: false };
  }
};

// ============================================
// FUNCIÓN: resetSeedState (para reiniciar)
// ============================================
export const resetSeedState = () => {
  SEED_EXECUTED = false;
  SEED_PROMISE = null;
  console.log("🔄 Estado del seed reiniciado");
};

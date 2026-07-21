// src/database/apiClient.js
const API_URL = "/api/lecturas";

export const obtenerTodasLasLecturas = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (data.success) {
      const lecturas = {};
      data.apartamentos.forEach((row) => {
        lecturas[row.apto] = row.ultima_lectura;
      });
      return lecturas;
    }
    return {};
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
};

export const guardarLecturaApto = async (apto, lectura) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apto, lectura }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false };
  }
};

export const obtenerHistorial = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.success ? data.historial : [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const guardarHistorial = async (datos) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datosCompletos: datos }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false };
  }
};

export const migrarDatosIniciales = async () => {
  try {
    const historial = await obtenerHistorial();
    if (historial.length > 0) {
      return { success: false, message: "Ya existen datos" };
    }

    // ==========================================
    // DATOS CORRECTOS PARA EL PERÍODO 1 (18 ABRIL - 20 MAYO)
    // ==========================================
    // Total Facturado: 616 kWh
    // Consumos: 202:78, 203:200, 301:109.6, 302:149.8, 201:78.6
    // ==========================================

    // Lectura del 18 de abril (INICIO del Período 1)
    const LECTURA_INICIO_PERIODO_1 = {
      202: 145656,
      203: 137462,
      301: 183709,
      302: 167209,
    };

    // Lectura del 20 de mayo (FIN del Período 1 / INICIO del Período 2)
    // ¡ESTOS SON LOS VALORES CORRECTOS para que el Período 2 funcione!
    const LECTURA_FIN_PERIODO_1 = {
      202: 145807, // 146436 - 629 (62.9 × 10)
      203: 137947, // 139462 - 1515 (151.5 × 10)
      301: 183821, // 184805 - 984 (98.4 × 10)
      302: 167392, // 168707 - 1315 (131.5 × 10)
    };

    const datosIniciales = {
      periodo: {
        inicio: "2026-04-18",
        fin: "2026-05-20",
      },
      valorKW: 819.66,
      totalFacturado: 616,
      aseo: 29142,
      aptos: {
        202: {
          actual: LECTURA_FIN_PERIODO_1["202"], // 145,807
          anterior: LECTURA_INICIO_PERIODO_1["202"], // 145,656
        },
        203: {
          actual: LECTURA_FIN_PERIODO_1["203"], // 137,947
          anterior: LECTURA_INICIO_PERIODO_1["203"], // 137,462
        },
        301: {
          actual: LECTURA_FIN_PERIODO_1["301"], // 183,821
          anterior: LECTURA_INICIO_PERIODO_1["301"], // 183,709
        },
        302: {
          actual: LECTURA_FIN_PERIODO_1["302"], // 167,392
          anterior: LECTURA_INICIO_PERIODO_1["302"], // 167,209
        },
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

    // Primero guardar las lecturas en la tabla apartamentos
    // para que cuando la aplicación consulte, tenga las lecturas del 20 de mayo
    for (const [apto, lectura] of Object.entries(LECTURA_FIN_PERIODO_1)) {
      await guardarLecturaApto(apto, lectura);
    }

    // Luego guardar el historial completo
    return await guardarHistorial(datosIniciales);
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: error.message };
  }
};

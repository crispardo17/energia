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

    const datosIniciales = {
      periodo: { inicio: "2026-04-18", fin: "2026-05-20" },
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

    return await guardarHistorial(datosIniciales);
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: error.message };
  }
};

import Dexie from "dexie";

// Crear la base de datos
const db = new Dexie("EdificioElectricidad");

// Definir las tablas
db.version(1).stores({
  // Tabla de apartamentos: guarda la última lectura de cada uno
  apartamentos: "apto, ultimaLectura, fechaActualizacion",

  // Tabla de historial: guarda todos los meses
  historial: "id, fechaInicio, fechaFin, totalGeneral",

  // Tabla de configuración: valores que no cambian
  configuracion: "clave, valor",
});

export default db;

// Función para guardar la lectura de un apartamento
export const guardarLecturaApto = async (apto, lectura) => {
  await db.apartamentos.put({
    apto,
    ultimaLectura: lectura,
    fechaActualizacion: new Date().toISOString(),
  });
};

// Función para obtener la última lectura de un apartamento
export const obtenerUltimaLectura = async (apto) => {
  const registro = await db.apartamentos.get(apto);
  return registro ? registro.ultimaLectura : 0;
};

// Función para obtener todas las lecturas anteriores
export const obtenerTodasLasLecturas = async () => {
  const aptos = ["202", "203", "301", "302"];
  const lecturas = {};

  for (const apto of aptos) {
    lecturas[apto] = await obtenerUltimaLectura(apto);
  }

  return lecturas;
};

// Función para guardar un mes en el historial
export const guardarHistorial = async (datos) => {
  await db.historial.add({
    id: Date.now(),
    fechaInicio: datos.periodo.inicio,
    fechaFin: datos.periodo.fin,
    totalGeneral: datos.resumen.totalGeneral,
    datosCompletos: datos,
    fechaRegistro: new Date().toISOString(),
  });
};

// Función para obtener el historial completo
export const obtenerHistorial = async () => {
  return await db.historial.toArray();
};

// Función para guardar configuración
export const guardarConfiguracion = async (clave, valor) => {
  await db.configuracion.put({ clave, valor });
};

// Función para obtener configuración
export const obtenerConfiguracion = async (clave) => {
  const registro = await db.configuracion.get(clave);
  return registro ? registro.valor : null;
};

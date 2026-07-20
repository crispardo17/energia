const APTOS = ["202", "203", "301", "302"];

export const calcularConsumos = (lecturas, valorKW) => {
  const consumos = {};
  let subtotal = 0;

  APTOS.forEach((apto) => {
    // Dividir entre 10 porque el medidor registra en décimas
    const consumo = (lecturas[apto].actual - lecturas[apto].anterior) / 10;
    consumos[apto] = {
      consumo: Math.round(consumo * 100) / 100, // Redondear a 2 decimales
      valor: Math.round(consumo * valorKW * 100) / 100,
    };
    subtotal += consumo;
  });

  // Calcular 201 como residuo
  const totalEdificio = lecturas.totalFacturado || 520;
  const consumo201 = Math.round((totalEdificio - subtotal) * 100) / 100;

  consumos["201"] = {
    consumo: consumo201,
    valor: Math.round(consumo201 * valorKW * 100) / 100,
  };

  return consumos;
};

export const generarResumen = (consumos, cargoFijo = 30154) => {
  const aptos = ["202", "203", "301", "302", "201"];
  let totalGeneral = 0;
  let totalConsumo = 0;
  let totalEnergia = 0;
  let totalCargoFijo = 0;

  const datos = aptos.map((apto) => {
    const total = consumos[apto].valor + cargoFijo;
    totalGeneral += total;
    totalConsumo += consumos[apto].consumo;
    totalEnergia += consumos[apto].valor;
    totalCargoFijo += cargoFijo;

    return {
      apto,
      consumo: consumos[apto].consumo,
      valorEnergia: consumos[apto].valor,
      cargoFijo: cargoFijo,
      total: Math.round(total * 100) / 100,
    };
  });

  return {
    datos,
    totalGeneral: Math.round(totalGeneral * 100) / 100,
    totalConsumo: Math.round(totalConsumo * 100) / 100,
    totalEnergia: Math.round(totalEnergia * 100) / 100,
    totalCargoFijo: Math.round(totalCargoFijo * 100) / 100,
  };
};

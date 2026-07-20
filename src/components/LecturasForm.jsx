import { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  Database,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";
import {
  obtenerTodasLasLecturas,
  guardarLecturaApto,
  guardarHistorial,
} from "../database/neon";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";

const APTOS = ["202", "203", "301", "302"];

const COLORS = {
  202: "border-blue-200 bg-blue-50",
  203: "border-green-200 bg-green-50",
  301: "border-purple-200 bg-purple-50",
  302: "border-orange-200 bg-orange-50",
};

const ICONS = {
  202: "🔵",
  203: "🟢",
  301: "🟣",
  302: "🟠",
};

export default function LecturasForm({ onGuardar }) {
  const [lecturas, setLecturas] = useState({
    periodo: { inicio: "", fin: "" },
    aptos: {
      202: { actual: "", anterior: 0 },
      203: { actual: "", anterior: 0 },
      301: { actual: "", anterior: 0 },
      302: { actual: "", anterior: 0 },
    },
    valorKW: 839.67,
    totalFacturado: 520,
    aseo: 30154,
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [alert, setAlert] = useState(null);
  const [consumosPreview, setConsumosPreview] = useState(null);

  useEffect(() => {
    cargarLecturasAnteriores();
  }, []);

  useEffect(() => {
    calcularPreview();
  }, [lecturas.aptos, lecturas.valorKW, lecturas.totalFacturado]);

  const cargarLecturasAnteriores = async () => {
    setCargando(true);
    try {
      const lecturasAnteriores = await obtenerTodasLasLecturas();

      setLecturas((prev) => {
        const nuevasLecturas = { ...prev };
        APTOS.forEach((apto) => {
          const lecturaAnterior = lecturasAnteriores[apto] || 0;
          nuevasLecturas.aptos[apto].anterior = lecturaAnterior;
        });
        return nuevasLecturas;
      });

      if (Object.values(lecturasAnteriores).some((v) => v > 0)) {
        setAlert({
          type: "success",
          message: "✅ Lecturas anteriores cargadas automáticamente",
        });
      }
    } catch (error) {
      console.error("Error al cargar lecturas:", error);
    } finally {
      setCargando(false);
    }
  };

  const calcularPreview = () => {
    const aptos = ["202", "203", "301", "302"];
    let subtotal = 0;
    const consumos = {};

    aptos.forEach((apto) => {
      const anterior = parseFloat(lecturas.aptos[apto].anterior) || 0;
      const actual = parseFloat(lecturas.aptos[apto].actual) || 0;
      if (actual > 0 && anterior > 0) {
        const consumo = (actual - anterior) / 10;
        consumos[apto] = Math.round(consumo * 100) / 100;
        subtotal += consumo;
      } else {
        consumos[apto] = 0;
      }
    });

    const totalEdificio = parseFloat(lecturas.totalFacturado) || 0;
    const consumo201 =
      totalEdificio > 0
        ? Math.round((totalEdificio - subtotal) * 100) / 100
        : 0;

    setConsumosPreview({
      aptos: consumos,
      apto201: consumo201,
      subtotal: Math.round(subtotal * 100) / 100,
      total: totalEdificio > 0 ? totalEdificio : subtotal + consumo201,
    });
  };

  const handleChange = (apto, campo, valor) => {
    setLecturas((prev) => ({
      ...prev,
      aptos: {
        ...prev.aptos,
        [apto]: {
          ...prev.aptos[apto],
          [campo]: parseFloat(valor) || 0,
        },
      },
    }));
    if (alert && alert.type === "error") {
      setAlert(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    if (!lecturas.periodo.inicio || !lecturas.periodo.fin) {
      setAlert({
        type: "error",
        message: "❌ Por favor, selecciona las fechas del período",
      });
      setGuardando(false);
      return;
    }

    const allFilled = Object.values(lecturas.aptos).every((a) => a.actual > 0);

    if (!allFilled) {
      setAlert({
        type: "error",
        message: "❌ Por favor, completa todas las lecturas actuales",
      });
      setGuardando(false);
      return;
    }

    const validarLecturas = Object.entries(lecturas.aptos).every(
      ([apto, data]) => {
        if (data.actual <= data.anterior) {
          setAlert({
            type: "error",
            message: `❌ La lectura actual del apto ${apto} debe ser mayor que la anterior (${data.anterior})`,
          });
          return false;
        }
        return true;
      },
    );

    if (!validarLecturas) {
      setGuardando(false);
      return;
    }

    const consumos = {};
    let subtotal = 0;
    const lista = ["202", "203", "301", "302"];

    lista.forEach((apto) => {
      const consumo =
        (lecturas.aptos[apto].actual - lecturas.aptos[apto].anterior) / 10;
      consumos[apto] = {
        consumo: Math.round(consumo * 100) / 100,
        valor: Math.round(consumo * lecturas.valorKW * 100) / 100,
      };
      subtotal += consumo;
    });

    const consumo201 =
      Math.round((lecturas.totalFacturado - subtotal) * 100) / 100;
    consumos["201"] = {
      consumo: consumo201,
      valor: Math.round(consumo201 * lecturas.valorKW * 100) / 100,
    };

    const aptosLista = ["202", "203", "301", "302", "201"];
    let totalGeneral = 0;
    const resumen = aptosLista.map((apto) => {
      const aseoValue = lecturas.aseo || 0;
      const total = consumos[apto].valor + aseoValue;
      totalGeneral += total;
      return {
        apto,
        consumo: consumos[apto].consumo,
        valorEnergia: consumos[apto].valor,
        aseo: aseoValue,
        total: Math.round(total * 100) / 100,
      };
    });

    const datosCompletos = {
      ...lecturas,
      consumos,
      resumen: {
        datos: resumen,
        totalGeneral: Math.round(totalGeneral * 100) / 100,
      },
    };

    try {
      // Guardar lecturas en Neon
      for (const apto of APTOS) {
        await guardarLecturaApto(apto, lecturas.aptos[apto].actual);
      }

      // Guardar en el historial de Neon
      const resultado = await guardarHistorial(datosCompletos);

      if (!resultado.success) {
        throw new Error(resultado.error);
      }

      setAlert({
        type: "success",
        message: "✅ Lecturas guardadas correctamente en la nube",
      });
      onGuardar(datosCompletos);

      await cargarLecturasAnteriores();

      setLecturas((prev) => {
        const nuevas = { ...prev };
        APTOS.forEach((apto) => {
          nuevas.aptos[apto].actual = "";
        });
        return nuevas;
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      setAlert({
        type: "error",
        message: "❌ Error al guardar en la base de datos",
      });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Ingresar Lecturas
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Database size={14} />
              Datos en la nube (Neon)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={cargarLecturasAnteriores}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <RefreshCw size={14} />
          Recargar
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar size={16} />
            Fecha Inicio
          </label>
          <input
            type="date"
            className="input-field"
            value={lecturas.periodo.inicio}
            onChange={(e) =>
              setLecturas((prev) => ({
                ...prev,
                periodo: { ...prev.periodo, inicio: e.target.value },
              }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar size={16} />
            Fecha Fin
          </label>
          <input
            type="date"
            className="input-field"
            value={lecturas.periodo.fin}
            onChange={(e) =>
              setLecturas((prev) => ({
                ...prev,
                periodo: { ...prev.periodo, fin: e.target.value },
              }))
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {APTOS.map((apto) => (
          <div key={apto} className={`border-2 rounded-xl p-4 ${COLORS[apto]}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{ICONS[apto]}</span>
              <h3 className="font-bold text-gray-800 text-lg">Apto {apto}</h3>
              {lecturas.aptos[apto].anterior > 0 && (
                <span className="badge badge-green ml-auto">✅ Cargado</span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 flex items-center gap-1">
                  <Database size={12} />
                  Lectura Anterior{" "}
                  <span className="text-green-600 text-xs">(automático)</span>
                </label>
                <input
                  type="number"
                  className="input-field input-disabled"
                  value={lecturas.aptos[apto].anterior}
                  disabled
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">
                  Lectura Actual <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={lecturas.aptos[apto].actual}
                  onChange={(e) => handleChange(apto, "actual", e.target.value)}
                  placeholder={`Ej: ${lecturas.aptos[apto].anterior + 100}`}
                  required
                />
                {lecturas.aptos[apto].actual > 0 &&
                  lecturas.aptos[apto].anterior > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Consumo estimado:{" "}
                      {(lecturas.aptos[apto].actual -
                        lecturas.aptos[apto].anterior) /
                        10}{" "}
                      kWh
                    </p>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign size={16} />
            Valor kWh ($)
          </label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={lecturas.valorKW}
            onChange={(e) =>
              setLecturas((prev) => ({
                ...prev,
                valorKW: parseFloat(e.target.value) || 0,
              }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <TrendingUp size={16} />
            Total Facturado (kWh)
          </label>
          <input
            type="number"
            className="input-field"
            value={lecturas.totalFacturado}
            onChange={(e) =>
              setLecturas((prev) => ({
                ...prev,
                totalFacturado: parseFloat(e.target.value) || 0,
              }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign size={16} />
            ASEO ($)
          </label>
          <input
            type="number"
            className="input-field"
            value={lecturas.aseo}
            onChange={(e) =>
              setLecturas((prev) => ({
                ...prev,
                aseo: parseFloat(e.target.value) || 0,
              }))
            }
            required
          />
        </div>
      </div>

      {consumosPreview && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            📊 Vista previa de consumos
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            {Object.entries(consumosPreview.aptos).map(([apto, consumo]) => (
              <div key={apto} className="bg-white rounded-lg p-2 shadow-sm">
                <p className="text-xs text-gray-500">Apto {apto}</p>
                <p className="font-bold text-blue-600">{consumo}</p>
              </div>
            ))}
            <div className="bg-blue-100 rounded-lg p-2 shadow-sm">
              <p className="text-xs text-gray-600">201 (ZC)</p>
              <p className="font-bold text-blue-700">
                {consumosPreview.apto201}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-2 shadow-sm">
              <p className="text-xs text-gray-600">Total</p>
              <p className="font-bold text-green-700">
                {consumosPreview.total}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <Database size={14} />
        💡 Los datos se guardan en la nube. ¡Todos los vecinos verán la misma
        información!
      </div>

      <button type="submit" className="btn-primary" disabled={guardando}>
        {guardando ? (
          <>
            <RefreshCw className="animate-spin" size={20} />
            Guardando...
          </>
        ) : (
          <>
            <Save size={20} />
            Guardar Lecturas y Calcular
          </>
        )}
      </button>
    </form>
  );
}

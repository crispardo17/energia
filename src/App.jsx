import { useState, useEffect } from "react";
import LecturasForm from "./components/LecturasForm";
import ResumenMensual from "./components/ResumenMensual";
import Graficas from "./components/Graficas";
import AdminPanel from "./components/AdminPanel";
import { Zap, History, Database, RefreshCw } from "lucide-react";
import { obtenerHistorial } from "./database/db";
import { seedInitialData } from "./database/seed";

function App() {
  const [historial, setHistorial] = useState([]);
  const [lecturasActuales, setLecturasActuales] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensajeInicial, setMensajeInicial] = useState(null);
  const [seedEjecutado, setSeedEjecutado] = useState(false);

  // Cargar historial desde la base de datos - SOLO UNA VEZ
  useEffect(() => {
    const init = async () => {
      setCargando(true);
      try {
        // 1. Verificar si ya hay datos
        const datos = await obtenerHistorial();

        if (datos.length > 0) {
          // Si hay datos, mostrarlos
          const ordenado = datos.sort((a, b) => b.id - a.id);
          setHistorial(ordenado);
          setLecturasActuales(ordenado[0].datosCompletos);
          setSeedEjecutado(true);
        } else {
          // 2. Si NO hay datos, ejecutar seed solo si no se ha ejecutado
          if (!seedEjecutado) {
            setSeedEjecutado(true);
            setMensajeInicial({
              type: "info",
              message: "📥 Cargando datos iniciales del edificio...",
            });

            const resultado = await seedInitialData();

            if (resultado.success) {
              setMensajeInicial({
                type: "success",
                message: "✅ Datos del primer período cargados automáticamente",
              });

              // Recargar historial después del seed
              const nuevosDatos = await obtenerHistorial();
              const ordenado = nuevosDatos.sort((a, b) => b.id - a.id);
              setHistorial(ordenado);
              if (ordenado.length > 0) {
                setLecturasActuales(ordenado[0].datosCompletos);
              }
            } else {
              setMensajeInicial({
                type: "info",
                message:
                  "📋 No hay datos guardados. Ingresa las lecturas del primer mes.",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar historial:", error);
        setMensajeInicial({
          type: "error",
          message: "❌ Error al cargar los datos",
        });
      } finally {
        setCargando(false);
      }
    };

    init();
  }, []); // Array vacío = solo se ejecuta UNA VEZ

  const handleGuardarLecturas = (lecturas) => {
    // Recargar historial después de guardar
    const recargar = async () => {
      try {
        const datos = await obtenerHistorial();
        const ordenado = datos.sort((a, b) => b.id - a.id);
        setHistorial(ordenado);
        setLecturasActuales(lecturas);
        setMensajeInicial(null);
      } catch (error) {
        console.error("Error al recargar:", error);
      }
    };
    recargar();
  };

  const handleResetDB = () => {
    setHistorial([]);
    setLecturasActuales(null);
    setSeedEjecutado(false);
    setMensajeInicial({
      type: "info",
      message: "🔄 Base de datos reiniciada. Recargando...",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={32} />
              <h1 className="text-2xl font-bold">⚡ Gestión de Electricidad</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-80 flex items-center gap-1">
                <Database size={16} />
                {historial.length} meses registrados
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {cargando ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mensaje de estado */}
            {mensajeInicial && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  mensajeInicial.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : mensajeInicial.type === "error"
                      ? "bg-red-50 border border-red-200 text-red-700"
                      : "bg-blue-50 border border-blue-200 text-blue-700"
                }`}
              >
                <p className="text-sm">{mensajeInicial.message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LecturasForm onGuardar={handleGuardarLecturas} />

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <History className="text-blue-600" />
                  Últimos Registros
                </h2>
                {historial.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay registros aún</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Ingresa las lecturas del mes para comenzar
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {historial.slice(0, 5).map((h) => (
                      <li
                        key={h.id}
                        className="py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setLecturasActuales(h.datosCompletos)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {h.fechaInicio &&
                                new Date(h.fechaInicio).toLocaleDateString()}
                              {" - "}
                              {h.fechaFin &&
                                new Date(h.fechaFin).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                              {new Date(h.fechaRegistro).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="font-bold text-blue-600">
                            ${h.totalGeneral?.toLocaleString() || 0}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {historial.length > 5 && (
                  <p className="text-sm text-gray-400 text-center mt-2">
                    + {historial.length - 5} registros más
                  </p>
                )}
              </div>
            </div>

            {lecturasActuales && <ResumenMensual lecturas={lecturasActuales} />}

            <Graficas historial={historial.map((h) => h.datosCompletos)} />

            {/* Panel de Administración */}
            <div className="mt-8">
              <AdminPanel onReset={handleResetDB} />
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white text-center py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm opacity-75 flex items-center justify-center gap-2">
            <Database size={16} />
            Datos guardados en IndexedDB (base de datos local del navegador)
          </p>
          <p className="text-xs opacity-50 mt-1">
            Los datos persisten aunque cierres el navegador
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LecturasForm from "../components/LecturasForm";
import ResumenMensual from "../components/ResumenMensual";
import Graficas from "../components/Graficas";
import AdminPanel from "../components/AdminPanel";
import LoginModal from "../components/LoginModal";
import { Zap, History, Database, LogOut } from "lucide-react";
import { obtenerHistorial, migrarDatosIniciales } from "../database/apiClient";

export default function Electricidad() {
  const {
    login,
    logout,
    isAuthenticated,
    usuario,
    cargando: authCargando,
  } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [lecturasActuales, setLecturasActuales] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mensajeInicial, setMensajeInicial] = useState(null);
  const [errorLogin, setErrorLogin] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    if (!authCargando) {
      if (isAuthenticated) {
        setMostrarLogin(false);
        cargarDatos();
      } else {
        setMostrarLogin(true);
        setCargandoDatos(false);
      }
    }
  }, [authCargando, isAuthenticated]);

  const cargarDatos = async () => {
    setCargandoDatos(true);
    try {
      const datos = await obtenerHistorial();

      if (datos.length > 0) {
        const ordenado = datos.sort((a, b) => b.id - a.id);
        setHistorial(ordenado);
        setLecturasActuales(ordenado[0].datos_completos);
      } else {
        setMensajeInicial({
          type: "info",
          message: "📥 Cargando datos iniciales...",
        });
        const resultado = await migrarDatosIniciales();
        if (resultado.success) {
          setMensajeInicial({
            type: "success",
            message: "✅ Datos del primer período cargados",
          });
          const nuevosDatos = await obtenerHistorial();
          setHistorial(nuevosDatos);
          if (nuevosDatos.length > 0) {
            setLecturasActuales(nuevosDatos[0].datos_completos);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMensajeInicial({
        type: "error",
        message: "❌ Error al cargar los datos",
      });
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleLogin = async (usuario, contrasena) => {
    const result = await login(usuario, contrasena);
    if (result.success) {
      setMostrarLogin(false);
      setErrorLogin(null);
      // El useEffect se encargará de cargar los datos
    } else {
      setErrorLogin(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    setMostrarLogin(true);
    setHistorial([]);
    setLecturasActuales(null);
  };

  const handleGuardarLecturas = (lecturas) => {
    const recargar = async () => {
      const datos = await obtenerHistorial();
      setHistorial(datos);
      setLecturasActuales(lecturas);
      setMensajeInicial(null);
    };
    recargar();
  };

  // Si está cargando la autenticación, mostrar spinner
  if (authCargando) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Verificando sesión...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si no está autenticado, mostrar pantalla de bloqueo
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="pt-20 max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockIcon className="text-blue-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Acceso Restringido
              </h2>
              <p className="text-gray-500 mb-6">
                Esta sección está protegida. Inicia sesión para continuar.
              </p>
              <button
                onClick={() => setMostrarLogin(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </main>
        <Footer />

        {mostrarLogin && (
          <LoginModal
            onLogin={handleLogin}
            onClose={() => setMostrarLogin(false)}
            error={errorLogin}
          />
        )}
      </div>
    );
  }

  // Contenido principal (autenticado)
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="pt-20 max-w-7xl mx-auto px-4 py-6">
        {/* Banner de usuario autenticado */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-sm text-green-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
            ✅ Sesión iniciada como <strong>{usuario}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition font-medium"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>

        {cargandoDatos ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <>
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
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {historial.slice(0, 5).map((h) => (
                      <li
                        key={h.id}
                        className="py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setLecturasActuales(h.datos_completos)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {new Date(h.fecha_inicio).toLocaleDateString()} -{" "}
                              {new Date(h.fecha_fin).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="font-bold text-blue-600">
                            ${h.total_general?.toLocaleString() || 0}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {lecturasActuales && <ResumenMensual lecturas={lecturasActuales} />}
            <Graficas historial={historial.map((h) => h.datos_completos)} />
            <div className="mt-8">
              <AdminPanel
                onReset={() => {
                  setHistorial([]);
                  setLecturasActuales(null);
                }}
              />
            </div>
          </>
        )}
      </main>

      <Footer />

      {mostrarLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setMostrarLogin(false)}
          error={errorLogin}
        />
      )}
    </div>
  );
}

// Componente LockIcon (para no importar duplicado)
function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

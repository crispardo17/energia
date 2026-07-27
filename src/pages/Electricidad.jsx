import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LecturasForm from "../components/LecturasForm";
import ResumenMensual from "../components/ResumenMensual";
import Graficas from "../components/Graficas";
import AdminPanel from "../components/AdminPanel";
import AdminUsuarios from "../components/AdminUsuarios";
import LoginModal from "../components/LoginModal";
import {
  Zap,
  History,
  Database,
  LogOut,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Users,
  Home,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { obtenerHistorial, migrarDatosIniciales } from "../database/apiClient";

export default function Electricidad() {
  const {
    login,
    logout,
    isAuthenticated,
    usuario,
    cargando: authCargando,
    isAdmin,
  } = useAuth();

  const [historial, setHistorial] = useState([]);
  const [lecturasActuales, setLecturasActuales] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mensajeInicial, setMensajeInicial] = useState(null);
  const [errorLogin, setErrorLogin] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Tabs disponibles
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "lecturas", label: "Lecturas", icon: FileText },
    { id: "graficas", label: "Gráficas", icon: BarChart3 },
    ...(isAdmin
      ? [{ id: "admin", label: "Administración", icon: Settings }]
      : []),
    ...(isAdmin ? [{ id: "usuarios", label: "Usuarios", icon: Users }] : []),
  ];

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Top Bar con usuario y navegación móvil */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Botón menú móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu size={24} />
            </button>

            {/* Título y usuario */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "lecturas" && "Gestión de Lecturas"}
                {activeTab === "graficas" && "Estadísticas"}
                {activeTab === "admin" && "Administración"}
                {activeTab === "usuarios" && "Usuarios"}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                  {usuario}
                  {isAdmin && (
                    <span className="ml-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 transition font-medium flex items-center gap-1"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>

            {/* Desktop Tabs - Navegación */}
            <div className="hidden lg:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
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

            {/* Dashboard - Vista principal */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Tarjetas de resumen */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      Total Consumo
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {historial
                        .reduce((sum, h) => {
                          const total =
                            h.datos_completos?.resumen?.datos?.reduce(
                              (s, d) => s + d.consumo,
                              0,
                            ) || 0;
                          return sum + total;
                        }, 0)
                        .toFixed(0)}{" "}
                      kWh
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {historial.length} meses registrados
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      Total Facturado
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      $
                      {historial
                        .reduce((sum, h) => sum + (h.total_general || 0), 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Energía + ASEO</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      Último Mes
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {historial.length > 0
                        ? `${historial[0].datos_completos?.resumen?.datos?.reduce((s, d) => s + d.consumo, 0).toFixed(0)} kWh`
                        : "0"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {historial.length > 0
                        ? new Date(
                            historial[0].fecha_inicio,
                          ).toLocaleDateString()
                        : "Sin datos"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      Apartamentos
                    </p>
                    <p className="text-2xl font-bold text-orange-600">5</p>
                    <p className="text-xs text-gray-400 mt-1">
                      4 aptos + Zonas Comunes
                    </p>
                  </div>
                </div>

                {/* Gráfica y resumen reciente */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BarChart3 size={18} className="text-blue-600" />
                      Consumo Reciente
                    </h3>
                    <Graficas
                      historial={historial.map((h) => h.datos_completos)}
                    />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" />
                      Últimos Registros
                    </h3>
                    {historial.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay registros aún
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {historial.slice(0, 5).map((h) => (
                          <li
                            key={h.id}
                            className="py-3 hover:bg-gray-50 cursor-pointer px-2 rounded-lg transition"
                            onClick={() =>
                              setLecturasActuales(h.datos_completos)
                            }
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-sm">
                                  {new Date(
                                    h.fecha_inicio,
                                  ).toLocaleDateString()}{" "}
                                  - {new Date(h.fecha_fin).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="font-bold text-blue-600 text-sm">
                                ${h.total_general?.toLocaleString() || 0}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Resumen del período actual */}
                {lecturasActuales && (
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <ResumenMensual lecturas={lecturasActuales} />
                  </div>
                )}
              </div>
            )}

            {/* Lecturas */}
            {activeTab === "lecturas" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText size={24} className="text-blue-600" />
                    Ingresar Lecturas
                  </h2>
                  <LecturasForm onGuardar={handleGuardarLecturas} />
                </div>
              </div>
            )}

            {/* Gráficas */}
            {activeTab === "graficas" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 size={24} className="text-blue-600" />
                    Estadísticas de Consumo
                  </h2>
                  <Graficas
                    historial={historial.map((h) => h.datos_completos)}
                  />
                </div>
              </div>
            )}

            {/* Administración */}
            {activeTab === "admin" && isAdmin && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings size={24} className="text-blue-600" />
                    Administración del Sistema
                  </h2>
                  <AdminPanel
                    onReset={() => {
                      setHistorial([]);
                      setLecturasActuales(null);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Usuarios */}
            {activeTab === "usuarios" && isAdmin && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={24} className="text-blue-600" />
                    Gestión de Usuarios
                  </h2>
                  <AdminUsuarios />
                </div>
              </div>
            )}
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

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-bold text-lg text-gray-800">Menú</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente LockIcon
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

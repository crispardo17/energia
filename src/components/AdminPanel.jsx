import { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  Database,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import Alert from "./Alert";
import { useAuth } from "../context/AuthContext";

const API_URL = "/api/lecturas";

export default function AdminPanel({ onReset }) {
  const { verificarPasswordAdmin } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showData, setShowData] = useState(false);
  const [dbData, setDbData] = useState(null);

  // Estados para la verificación de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [verificando, setVerificando] = useState(false);

  const resetDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.success) {
        setAlert({
          type: "success",
          message: "✅ Base de datos reiniciada correctamente. Recargando...",
        });
        if (onReset) onReset();
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(data.error || "Error al reiniciar la base de datos");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "❌ Error al reiniciar: " + error.message,
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const verDatos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.success) {
        setDbData(data);
        setShowData(!showData);

        if (!showData) {
          setAlert({
            type: "info",
            message: `📊 Datos cargados: ${data.apartamentos?.length || 0} apartamentos, ${data.historial?.length || 0} registros históricos`,
          });
        }
      } else {
        throw new Error(data.error || "Error al cargar los datos");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "❌ Error al cargar los datos: " + error.message,
      });
    }
  };

  // Manejar la verificación de contraseña antes de acciones sensibles
  const handleAccionSensible = (accion) => {
    setAccionPendiente(accion);
    setShowPasswordModal(true);
    setPassword("");
  };

  const confirmarAccion = async () => {
    setVerificando(true);
    try {
      const esValido = await verificarPasswordAdmin(password);

      if (esValido) {
        setShowPasswordModal(false);
        setPassword("");

        if (accionPendiente === "reiniciar") {
          setShowConfirm(true);
        } else if (accionPendiente === "verDatos") {
          await verDatos();
        }
        setAccionPendiente(null);
      } else {
        setAlert({ type: "error", message: "❌ Contraseña incorrecta" });
        setPassword("");
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "❌ Error al verificar: " + error.message,
      });
    } finally {
      setVerificando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
      {/* Modal de contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Verificación Requerida
              </h3>
              <p className="text-sm text-gray-500">
                Ingresa la contraseña de administrador para continuar
              </p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmarAccion()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-10"
                placeholder="Contraseña de administrador"
                autoFocus
                disabled={verificando}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {verificando && (
              <div className="mt-3 text-center text-sm text-gray-500">
                <RefreshCw
                  className="animate-spin inline-block mr-2"
                  size={16}
                />
                Verificando...
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setAccionPendiente(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
                disabled={verificando}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAccion}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={verificando}
              >
                {verificando ? "Verificando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Database className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              Administrar Base de Datos
            </h3>
            <p className="text-sm text-gray-500">
              Reiniciar o ver los datos guardados
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleAccionSensible("verDatos")}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
          >
            {showData ? <EyeOff size={16} /> : <Eye size={16} />}
            {showData ? "Ocultar Datos" : "Ver Datos"}
          </button>

          {!showConfirm ? (
            <button
              onClick={() => handleAccionSensible("reiniciar")}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
            >
              <Trash2 size={16} /> Reiniciar DB
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={resetDatabase}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />{" "}
                    Reiniciando...
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} /> Confirmar
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmación de eliminación */}
      {showConfirm && !loading && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} />
            ⚠️ ¡ATENCIÓN! Esto eliminará TODOS los datos guardados en la nube.
            ¿Estás seguro?
          </p>
        </div>
      )}

      {/* Visualización de datos */}
      {showData && dbData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-auto max-h-96">
          <h4 className="font-semibold text-gray-700 mb-2">
            📊 Datos en Neon:
          </h4>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-600">
              Apartamentos ({dbData.apartamentos?.length || 0}):
            </p>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200 mt-1 overflow-x-auto">
              {JSON.stringify(dbData.apartamentos, null, 2)}
            </pre>
          </div>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-600">
              Historial ({dbData.historial?.length || 0} registros):
            </p>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200 mt-1 overflow-x-auto max-h-40">
              {JSON.stringify(dbData.historial, null, 2)}
            </pre>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Configuración ({dbData.configuracion?.length || 0}):
            </p>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200 mt-1 overflow-x-auto">
              {JSON.stringify(dbData.configuracion || [], null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Alertas */}
      {alert && (
        <div className="mt-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
    </div>
  );
}

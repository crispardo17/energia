import { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  Database,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { neon } from "@neondatabase/serverless";
import Alert from "./Alert";

// ============================================
// CONEXIÓN A NEON
// ============================================
const sql = neon(import.meta.env.DATABASE_URL);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function AdminPanel({ onReset }) {
  // Estados
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showData, setShowData] = useState(false);
  const [dbData, setDbData] = useState(null);

  // ==========================================
  // REINICIAR BASE DE DATOS
  // ==========================================
  const resetDatabase = async () => {
    setLoading(true);
    try {
      // Eliminar todos los datos de las tablas
      await sql`TRUNCATE TABLE apartamentos, historial, configuracion RESTART IDENTITY;`;

      // Insertar datos iniciales de apartamentos
      await sql`
        INSERT INTO apartamentos (apto, ultima_lectura) VALUES
          ('202', 145656),
          ('203', 137462),
          ('301', 183709),
          ('302', 167209)
        ON CONFLICT (apto) DO NOTHING;
      `;

      setAlert({
        type: "success",
        message: "✅ Base de datos reiniciada correctamente. Recargando...",
      });

      // Notificar al componente padre
      if (onReset) onReset();

      // Recargar después de 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al reiniciar:", error);
      setAlert({
        type: "error",
        message: "❌ Error al reiniciar la base de datos: " + error.message,
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  // ==========================================
  // VER DATOS EN LA BASE DE DATOS
  // ==========================================
  const verDatos = async () => {
    try {
      const apartamentos = await sql`SELECT * FROM apartamentos ORDER BY apto;`;
      const historial =
        await sql`SELECT * FROM historial ORDER BY fecha_inicio DESC;`;
      const configuracion = await sql`SELECT * FROM configuracion;`;

      setDbData({ apartamentos, historial, configuracion });
      setShowData(!showData);

      if (!showData) {
        setAlert({
          type: "info",
          message: `📊 Datos cargados: ${apartamentos.length} apartamentos, ${historial.length} registros históricos`,
        });
      }
    } catch (error) {
      console.error("Error al ver datos:", error);
      setAlert({
        type: "error",
        message: "❌ Error al cargar los datos: " + error.message,
      });
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
      {/* HEADER */}
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
              Reiniciar o ver los datos guardados en Neon
            </p>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={verDatos}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
          >
            {showData ? <EyeOff size={16} /> : <Eye size={16} />}
            {showData ? "Ocultar Datos" : "Ver Datos"}
          </button>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
            >
              <Trash2 size={16} />
              Reiniciar DB
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
                    <RefreshCw className="animate-spin" size={16} />
                    Reiniciando...
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} />
                    Confirmar
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}
      {showConfirm && !loading && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} />
            ⚠️ ¡ATENCIÓN! Esto eliminará TODOS los datos guardados en la nube.
            ¿Estás seguro?
          </p>
        </div>
      )}

      {/* VISUALIZACIÓN DE DATOS */}
      {showData && dbData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-auto max-h-96">
          <h4 className="font-semibold text-gray-700 mb-2">
            📊 Datos en la Base de Datos (Neon):
          </h4>

          {/* Apartamentos */}
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-600">
              Apartamentos ({dbData.apartamentos.length}):
            </p>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200 mt-1 overflow-x-auto">
              {JSON.stringify(dbData.apartamentos, null, 2)}
            </pre>
          </div>

          {/* Historial */}
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-600">
              Historial ({dbData.historial.length} registros):
            </p>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200 mt-1 overflow-x-auto max-h-40">
              {JSON.stringify(dbData.historial, null, 2)}
            </pre>
          </div>

          {/* Configuración */}
          <div>
            <p className="text-sm font-medium text-gray-600">Configuración:</p>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200 mt-1 overflow-x-auto">
              {JSON.stringify(dbData.configuracion, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ALERTAS */}
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

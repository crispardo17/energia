import { useState } from "react";
import { Trash2, AlertTriangle, Database, RefreshCw } from "lucide-react";
import db from "../database/db";
import Alert from "./Alert";

export default function AdminPanel({ onReset }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const resetDatabase = async () => {
    setLoading(true);
    try {
      // Eliminar todas las tablas
      await db.apartamentos.clear();
      await db.historial.clear();
      await db.configuracion.clear();

      setAlert({
        type: "success",
        message:
          "✅ Base de datos reiniciada correctamente. Recarga la página.",
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
        message: "❌ Error al reiniciar la base de datos",
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Database className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              Administrar Base de Datos
            </h3>
            <p className="text-sm text-gray-500">
              Reiniciar o limpiar todos los datos
            </p>
          </div>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            Reiniciar DB
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={resetDatabase}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
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

      {showConfirm && !loading && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} />
            ⚠️ ¡ATENCIÓN! Esto eliminará TODOS los datos guardados. ¿Estás
            seguro?
          </p>
        </div>
      )}

      {alert && (
        <div className="mt-4">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}
    </div>
  );
}

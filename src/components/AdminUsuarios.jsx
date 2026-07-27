import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  X,
  Check,
  UserPlus,
  Shield,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Alert from "./Alert";

export default function AdminUsuarios() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [alert, setAlert] = useState(null);

  // Estados para el modal de crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    usuario: "",
    contrasena: "",
    rol: "usuario",
  });

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setUsuarios(data.usuarios);
      } else {
        setAlert({
          type: "error",
          message: data.error || "Error al cargar usuarios",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({ type: "error", message: "Error al conectar con el servidor" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const url = editando ? "/api/usuarios" : "/api/usuarios";
      const method = editando ? "PUT" : "POST";

      const body = editando
        ? { id: editando.id, ...formData }
        : { ...formData };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: "success",
          message: editando
            ? "Usuario actualizado correctamente"
            : "Usuario creado correctamente",
        });
        cerrarModal();
        cargarUsuarios();
      } else {
        setAlert({
          type: "error",
          message: data.error || "Error al guardar usuario",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({ type: "error", message: "Error al conectar con el servidor" });
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async (id, usuario) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${usuario}"?`)) return;

    setCargando(true);
    try {
      const response = await fetch(`/api/usuarios?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setAlert({
          type: "success",
          message: "Usuario eliminado correctamente",
        });
        cargarUsuarios();
      } else {
        setAlert({
          type: "error",
          message: data.error || "Error al eliminar usuario",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({ type: "error", message: "Error al conectar con el servidor" });
    } finally {
      setCargando(false);
    }
  };

  const abrirModalCrear = () => {
    setEditando(null);
    setFormData({ usuario: "", contrasena: "", rol: "usuario" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario) => {
    setEditando(usuario);
    setFormData({
      usuario: usuario.usuario,
      contrasena: "",
      rol: usuario.rol,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setFormData({ usuario: "", contrasena: "", rol: "usuario" });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Administrar Usuarios</h3>
            <p className="text-sm text-gray-500">
              Gestiona los usuarios con acceso a la plataforma
            </p>
          </div>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm"
        >
          <UserPlus size={16} />
          Nuevo Usuario
        </button>
      </div>

      {/* Alertas */}
      {alert && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Lista de usuarios */}
      {cargando && !modalAbierto ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="animate-spin text-purple-600" size={24} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {user.usuario}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.rol === "admin"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.rol === "admin" ? (
                          <span className="flex items-center gap-1">
                            <Shield size={12} /> Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <User size={12} /> Usuario
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(user.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(user)}
                          className="text-blue-600 hover:text-blue-800 transition p-1"
                          title="Editar usuario"
                        >
                          <Edit size={16} />
                        </button>
                        {user.usuario !== "admin" && (
                          <button
                            onClick={() => handleDelete(user.id, user.usuario)}
                            className="text-red-600 hover:text-red-800 transition p-1"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                {editando ? (
                  <Edit className="text-purple-600" size={20} />
                ) : (
                  <UserPlus className="text-purple-600" size={20} />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {editando ? "Editar Usuario" : "Nuevo Usuario"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, usuario: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required
                  disabled={editando}
                  placeholder="Nombre de usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {editando && "(dejar vacío para no cambiar)"}
                </label>
                <input
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) =>
                    setFormData({ ...formData, contrasena: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required={!editando}
                  placeholder="Contraseña"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({ ...formData, rol: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cargando ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                  {editando ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

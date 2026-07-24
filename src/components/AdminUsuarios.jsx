import { useState, useEffect } from "react";
import { Users, Plus, Trash2, RefreshCw } from "lucide-react";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/usuarios");
      const data = await response.json();
      if (data.success) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const agregarUsuario = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario || !nuevaContrasena) return;

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: nuevoUsuario,
          contrasena: nuevaContrasena,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNuevoUsuario("");
        setNuevaContrasena("");
        cargarUsuarios();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
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

      {/* Formulario para agregar usuario */}
      <form onSubmit={agregarUsuario} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Usuario"
          value={nuevoUsuario}
          onChange={(e) => setNuevoUsuario(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus size={16} /> Agregar
        </button>
      </form>

      {/* Lista de usuarios */}
      {cargando ? (
        <div className="flex justify-center py-4">
          <RefreshCw className="animate-spin text-purple-600" size={24} />
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {usuarios.map((user) => (
            <li
              key={user.id}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <span className="font-medium text-gray-900">
                  {user.usuario}
                </span>
                <span
                  className={`ml-3 text-xs px-2 py-1 rounded-full ${
                    user.rol === "admin"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.rol}
                </span>
              </div>
              {user.rol !== "admin" && (
                <button
                  onClick={async () => {
                    if (confirm("¿Eliminar este usuario?")) {
                      await fetch(`/api/usuarios?id=${user.id}`, {
                        method: "DELETE",
                      });
                      cargarUsuarios();
                    }
                  }}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

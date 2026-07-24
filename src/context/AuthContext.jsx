import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const session = localStorage.getItem("usuario_electricidad");
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.usuario) {
          setUsuario(data.usuario);
          setRol(data.rol || "usuario");
        }
      } catch (e) {
        localStorage.removeItem("usuario_electricidad");
      }
    }
    setCargando(false);
  }, []);

  const login = async (usuario, contrasena) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await response.json();

      if (data.success) {
        const sessionData = {
          usuario: data.usuario,
          rol: data.rol,
          fecha: new Date().toISOString(),
        };
        localStorage.setItem(
          "usuario_electricidad",
          JSON.stringify(sessionData),
        );
        setUsuario(data.usuario);
        setRol(data.rol);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: "Error al conectar con el servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("usuario_electricidad");
    setUsuario(null);
    setRol(null);
  };

  const verificarPasswordAdmin = async (contrasena) => {
    try {
      // Intentar login como admin
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: "admin", contrasena }),
      });

      const data = await response.json();
      return data.success && data.rol === "admin";
    } catch (error) {
      console.error("Error verificando admin:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        cargando,
        login,
        logout,
        verificarPasswordAdmin,
        isAuthenticated: !!usuario,
        isAdmin: rol === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

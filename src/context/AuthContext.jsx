import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("usuario_electricidad");
    if (session) {
      try {
        const data = JSON.parse(session);
        verificarToken(data.token).then((valid) => {
          if (valid) {
            setUsuario(data.usuario);
            setRol(data.rol || "usuario");
            setToken(data.token);
          } else {
            localStorage.removeItem("usuario_electricidad");
          }
          setCargando(false);
        });
      } catch (e) {
        localStorage.removeItem("usuario_electricidad");
        setCargando(false);
      }
    } else {
      setCargando(false);
    }
  }, []);

  const verificarToken = async (token) => {
    try {
      const response = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      return false;
    }
  };

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
          rol: data.rol || "usuario",
          token: data.token,
        };
        localStorage.setItem(
          "usuario_electricidad",
          JSON.stringify(sessionData),
        );
        setUsuario(data.usuario);
        setRol(data.rol || "usuario");
        setToken(data.token);
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
    setToken(null);
  };

  const verificarPasswordAdmin = async (contrasena) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: "admin", contrasena }),
      });
      const data = await response.json();
      return data.success && data.rol === "admin";
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        token,
        cargando,
        login,
        logout,
        verificarPasswordAdmin,
        isAuthenticated: !!usuario && !!token,
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

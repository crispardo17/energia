import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Electricidad from "./pages/Electricidad";
import Servicios from "./pages/Servicios";
import Nosotros from "./pages/Nosotros";
import Trabajos from "./pages/Trabajos";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/electricidad" element={<Electricidad />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/trabajos" element={<Trabajos />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

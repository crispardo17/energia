import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Electricidad from "./pages/Electricidad";
import Servicios from "./pages/Servicios";
import Nosotros from "./pages/Nosotros";
import Trabajos from "./pages/Trabajos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/electricidad" element={<Electricidad />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/trabajos" element={<Trabajos />} />
      </Routes>
    </Router>
  );
}

export default App;

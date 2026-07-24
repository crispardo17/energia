import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Electricidad from "./pages/Electricidad";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/electricidad" element={<Electricidad />} />
      </Routes>
    </Router>
  );
}

export default App;

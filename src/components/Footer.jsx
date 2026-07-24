import { Link } from "react-router-dom";
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-xl font-bold">ANGKOR</span>
            </div>
            <p className="text-gray-400 text-sm">
              Soluciones digitales que transforman negocios. Creamos
              experiencias que conectan marcas con personas.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/electricidad"
                  className="hover:text-white transition"
                >
                  ⚡ Gestión Electricidad
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="hover:text-white transition">
                  Servicios
                </Link>
              </li>
              <li>
                <a href="#footer" className="hover:text-white transition">
                  Contacto
                </a>
              </li>
              <li>
                <Link to="/trabajos" className="hover:text-white transition">
                  Trabajos
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} /> +57 300 123 4567
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> info@angkor.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Medellín, Colombia
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Linkedin size={18} />
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              © 2026 ANGKOR. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

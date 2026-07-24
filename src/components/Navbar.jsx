import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "INICIO" },
    { path: "/servicios", label: "SERVICIOS" },
    { path: "/trabajos", label: "TRABAJOS" },
    { path: "/nosotros", label: "NOSOTROS" },
    { path: "/contacto", label: "CONTACTO", isAnchor: true },
  ];

  const isActive = (path) => location.pathname === path;

  // Función para manejar el scroll al footer
  const handleContactClick = (e) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-wider text-gray-800">
              KORE
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              // Si es el enlace de contacto, usar <a> con scroll suave
              if (link.isAnchor) {
                return (
                  <a
                    key={link.path}
                    href="#footer"
                    onClick={handleContactClick}
                    className="text-sm tracking-wide transition-colors duration-200 text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide transition-colors duration-200 ${
                    isActive(link.path)
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Enlace a Electricidad - DESTACADO */}
            <Link
              to="/electricidad"
              className={`flex items-center gap-2 text-sm tracking-wide px-4 py-2 rounded-full transition-all duration-200 ${
                isActive("/electricidad")
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              <Zap size={16} />
              ELECTRICIDAD
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => {
              // Si es el enlace de contacto en móvil
              if (link.isAnchor) {
                return (
                  <a
                    key={link.path}
                    href="#footer"
                    onClick={handleContactClick}
                    className="block text-sm tracking-wide text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm tracking-wide transition-colors ${
                    isActive(link.path)
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Enlace a Electricidad en móvil */}
            <Link
              to="/electricidad"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm tracking-wide text-blue-600 font-semibold hover:text-blue-700 transition-colors pt-4 border-t border-gray-100"
            >
              <Zap size={16} />
              ELECTRICIDAD
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

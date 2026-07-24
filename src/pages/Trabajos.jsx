import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Briefcase,
  Star,
  Award,
  Building,
  ShoppingBag,
  GraduationCap,
  Globe,
  Landmark,
  Coffee,
  Factory,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Trabajos() {
  const [categoriaActiva, setCategoriaActiva] = useState("All");

  const categorias = [
    "All",
    "Branding",
    "Custom Projects",
    "eCommerce",
    "Education",
    "Featured",
    "Financial",
    "Hospitality",
    "Industry",
    "Portal",
    "Portfolio",
  ];

  const proyectos = [
    {
      id: 1,
      titulo: "Kedumba",
      descripcion: "Diseño web y branding para marca de montaña",
      categoria: "Branding",
      icono: Award,
      color: "blue",
    },
    {
      id: 2,
      titulo: "Jody Graham",
      descripcion: "Sitio web portfolio para artista",
      categoria: "Featured",
      icono: Star,
      color: "purple",
    },
    {
      id: 3,
      titulo: "Staht t25 Digital",
      descripcion: "Pull Tester - Herramienta digital para pruebas",
      categoria: "Industry",
      icono: Factory,
      color: "green",
    },
    {
      id: 4,
      titulo: "Sky Gardens Group",
      descripcion: "Portal inmobiliario de lujo",
      categoria: "Portal",
      icono: Building,
      color: "orange",
    },
    {
      id: 5,
      titulo: "The Lion Partnership",
      descripcion: "Sitio corporativo para firma financiera",
      categoria: "Financial",
      icono: Landmark,
      color: "red",
    },
    {
      id: 6,
      titulo: "Australian Fashion",
      descripcion: "E-commerce para tienda de moda",
      categoria: "eCommerce",
      icono: ShoppingBag,
      color: "indigo",
    },
    {
      id: 7,
      titulo: "EduSmart Academy",
      descripcion: "Plataforma educativa online",
      categoria: "Education",
      icono: GraduationCap,
      color: "cyan",
    },
    {
      id: 8,
      titulo: "Harbor View Hotel",
      descripcion: "Sitio web para hotel boutique",
      categoria: "Hospitality",
      icono: Coffee,
      color: "amber",
    },
    {
      id: 9,
      titulo: "EcoBrand",
      descripcion: "Branding y diseño para marca sustentable",
      categoria: "Branding",
      icono: Globe,
      color: "emerald",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        icon: "bg-blue-100",
        hover: "hover:bg-blue-50",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        icon: "bg-purple-100",
        hover: "hover:bg-purple-50",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        icon: "bg-green-100",
        hover: "hover:bg-green-50",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        icon: "bg-orange-100",
        hover: "hover:bg-orange-50",
      },
      red: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        icon: "bg-red-100",
        hover: "hover:bg-red-50",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        icon: "bg-indigo-100",
        hover: "hover:bg-indigo-50",
      },
      cyan: {
        bg: "bg-cyan-50",
        text: "text-cyan-600",
        border: "border-cyan-200",
        icon: "bg-cyan-100",
        hover: "hover:bg-cyan-50",
      },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        icon: "bg-amber-100",
        hover: "hover:bg-amber-50",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        icon: "bg-emerald-100",
        hover: "hover:bg-emerald-50",
      },
    };
    return colors[color] || colors.blue;
  };

  const proyectosFiltrados =
    categoriaActiva === "All"
      ? proyectos
      : proyectos.filter((p) => p.categoria === categoriaActiva);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold tracking-widest px-4 py-2 mb-6 rounded-full uppercase">
            Portafolio
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4">
            Nuestros <span className="font-bold">Trabajos</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Una selección de proyectos que reflejan nuestra pasión por el diseño
            y la innovación.
          </p>
          <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-6"></div>
        </div>
      </section>

      {/* ==========================================
          CATEGORÍAS (Filtros)
          ========================================== */}
      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  categoriaActiva === categoria
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          PROYECTOS GRID
          ========================================== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectosFiltrados.map((proyecto) => {
              const colors = getColorClasses(proyecto.color);
              const Icon = proyecto.icono;

              return (
                <div
                  key={proyecto.id}
                  className={`${colors.bg} border ${colors.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${colors.icon} p-3 rounded-xl`}>
                      <Icon className={`${colors.text}`} size={24} />
                    </div>
                    <span
                      className={`text-xs font-medium ${colors.text} bg-white px-3 py-1 rounded-full border ${colors.border}`}
                    >
                      {proyecto.categoria}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {proyecto.titulo}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {proyecto.descripcion}
                  </p>
                  <Link
                    to={`/trabajos/${proyecto.id}`}
                    className={`inline-flex items-center gap-2 ${colors.text} font-semibold hover:opacity-80 transition group`}
                  >
                    Ver proyecto
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          {proyectosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No hay proyectos en esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          CTA SECTION
          ========================================== */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            ¿Tienes un proyecto en <span className="font-bold">mente</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Hablemos de cómo podemos hacerlo realidad. Contáctanos y empecemos a
            trabajar.
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition group"
          >
            Contáctanos
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Link } from "react-router-dom";
import {
  Zap,
  Globe,
  PenTool,
  Code,
  Users,
  Server,
  Layout,
  ArrowRight,
  Rocket,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Servicios() {
  const servicios = [
    {
      id: 1,
      titulo: "Sitios Web",
      icono: Globe,
      color: "blue",
      descripcion:
        "Desarrollamos el front-end de nuestros sitios web WordPress con Oxygen Builder. Esto nos permite construir los sitios web más rápidos y confiables de la web. Con almacenamiento de datos de alta capacidad y una conexión rápida y confiable, ofrecemos la mejor experiencia WordPress posible.",
      tecnologias: ["LARAVEL", "VEHICLE WORK"],
    },
    {
      id: 2,
      titulo: "Desarrollo de Contenido",
      icono: PenTool,
      color: "purple",
      descripcion:
        "Si eres un redactor de contenido que quiere conocer lo que una estrategia sólida y un contenido de alta calidad pueden hacer por tu sitio web WordPress, estamos aquí para ayudarte. Desarrollamos contenido de alta calidad para sitios web WordPress, redes sociales y otros tipos de contenido.",
      tecnologias: ["Redacción", "Edición", "Desarrollo"],
    },
    {
      id: 3,
      titulo: "Desarrollo Full-Stack",
      icono: Code,
      color: "green",
      descripcion:
        "No solo somos redactores de contenido; somos una empresa de desarrollo full-stack. Podemos ayudarte con todos los aspectos de tu sitio web WordPress, desde el diseño hasta el desarrollo. Contamos con un equipo de desarrolladores experimentados que pueden ayudarte con cualquier proyecto.",
      tecnologias: ["LARAVEL", "VEHICLE WORK", "AI Chat Bot"],
    },
    {
      id: 4,
      titulo: "Experiencia de Usuario",
      icono: Users,
      color: "orange",
      descripcion:
        "Somos una empresa de desarrollo WordPress que se enfoca en crear una gran experiencia de usuario. Contamos con un equipo de desarrolladores experimentados que pueden ayudarte con cualquier proyecto.",
      tecnologias: ["Road Map", "Desarrollo"],
    },
    {
      id: 5,
      titulo: "Gestión y Hosting",
      icono: Server,
      color: "red",
      descripcion:
        "Dirigir un negocio exitoso ya es bastante difícil sin tener que preocuparte por las complejidades técnicas de mantener tu sitio web en funcionamiento. Contamos con un equipo de desarrolladores WordPress experimentados que pueden ayudarte con cualquier proyecto.",
      tecnologias: ["Roadmap y Seguridad", "Gestión Integral"],
    },
    {
      id: 6,
      titulo: "Diseño UX/UI",
      icono: Layout,
      color: "indigo",
      descripcion:
        "Somos una empresa de desarrollo WordPress que se enfoca en crear una gran experiencia de usuario. Contamos con un equipo de desarrolladores experimentados que pueden ayudarte con cualquier proyecto.",
      tecnologias: ["Diseño", "Prototipado", "Pruebas de Usuario"],
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        icon: "bg-blue-100",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        icon: "bg-purple-100",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        icon: "bg-green-100",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        icon: "bg-orange-100",
      },
      red: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        icon: "bg-red-100",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        icon: "bg-indigo-100",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ==========================================
          HERO SECTION - EN ESPAÑOL
          ========================================== */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda - Texto */}
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold tracking-widest px-4 py-2 mb-6 rounded-full uppercase">
                Nuestros Servicios
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
                Tenemos la capacidad
                <br />
                <span className="font-bold">
                  de construir activos digitales
                </span>
                <br />
                que cargan rápido y permiten
                <br />
                <span className="text-blue-600">
                  un crecimiento rápido de usuarios.
                </span>
              </h1>
              <p className="text-lg text-gray-600 mt-6 max-w-md">
                Soluciones digitales de alto rendimiento para impulsar tu
                negocio al siguiente nivel.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/contacto"
                  className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition flex items-center gap-2"
                >
                  Contáctanos <ArrowRight size={18} />
                </Link>
                <Link
                  to="/electricidad"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition flex items-center gap-2"
                >
                  <Zap size={18} />
                  Electricidad
                </Link>
              </div>
            </div>

            {/* Columna Derecha - Icono decorativo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 aspect-square flex items-center justify-center">
                <div className="text-center text-white">
                  <Rocket size={80} className="mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-bold">KORE</p>
                  <p className="text-sm opacity-80">Agencia Digital</p>
                </div>
              </div>
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SERVICIOS GRID
          ========================================== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Lo que <span className="font-bold">hacemos</span>
            </h2>
            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {servicios.map((servicio) => {
              const colors = getColorClasses(servicio.color);
              const Icon = servicio.icono;

              return (
                <div
                  key={servicio.id}
                  className={`${colors.bg} border ${colors.border} rounded-3xl p-8 transition-all duration-300 hover:shadow-lg`}
                >
                  {/* Icono y Título */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${colors.icon} p-3 rounded-xl`}>
                      <Icon className={`${colors.text}`} size={28} />
                    </div>
                    <h3 className={`text-2xl font-bold ${colors.text}`}>
                      {servicio.titulo}
                    </h3>
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {servicio.descripcion}
                  </p>

                  {/* Tecnologías / Servicios */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {servicio.titulo === "Sitios Web"
                        ? "Plataformas que usamos"
                        : servicio.titulo === "Desarrollo de Contenido"
                          ? "Servicios"
                          : servicio.titulo === "Desarrollo Full-Stack"
                            ? "AI Chat Bot"
                            : servicio.titulo === "Experiencia de Usuario"
                              ? "Diseño"
                              : servicio.titulo === "Gestión y Hosting"
                                ? "Gestión Integral"
                                : "Servicios"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {servicio.tecnologias.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full border ${colors.border}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link
                      to="/contacto"
                      className={`inline-flex items-center gap-2 ${colors.text} font-semibold hover:opacity-80 transition group`}
                    >
                      Saber más
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION
          ========================================== */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            ¿Listo para <span className="font-bold">impulsar</span> tu negocio?
          </h2>
          <p className="text-gray-400 mb-8">
            Contáctanos y descubre cómo podemos ayudarte a alcanzar tus
            objetivos.
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

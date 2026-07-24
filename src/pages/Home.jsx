import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Globe,
  Smartphone,
  TrendingUp,
  Star,
  Briefcase,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest px-4 py-2 mb-6 rounded-full uppercase">
                Agencia Digital
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight mb-6">
                Creamos
                <br />
                <span className="font-bold">experiencias</span>
                <br />
                que conectan.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Diseño, desarrollo y estrategia digital para hacer crecer tu
                negocio.
              </p>
              <div className="flex flex-wrap gap-4">
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

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <Zap size={64} className="text-blue-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-800">KORE</p>
                  <p className="text-gray-600">Agencia Digital</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO SECTION */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              NUESTROS <span className="font-bold">SERVICIOS</span>
            </h2>
            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Diseño Web</h3>
              <p className="text-gray-600 text-sm">
                Sitios web modernos, rápidos y optimizados para convertir
                visitantes en clientes.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-purple-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Apps Móviles</h3>
              <p className="text-gray-600 text-sm">
                Aplicaciones nativas y multiplataforma con experiencias
                excepcionales.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-green-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Marketing Digital</h3>
              <p className="text-gray-600 text-sm">
                Estrategias de crecimiento, SEO y publicidad para posicionar tu
                marca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURED WORK SECTION (NUEVO)
          ========================================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              TRABAJOS <span className="font-bold">DESTACADOS</span>
            </h2>
            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda - Información */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest px-4 py-2 rounded-full mb-6 uppercase">
                <Briefcase size={14} />
                Proyecto destacado
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Lucky Tiger Digital
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                LTD es una boutique creativa con sede en Sídney, liderada por
                dos mujeres muy talentosas que impulsan la transformación y el
                crecimiento a través del desarrollo empresarial y el diseño.
              </p>
              <Link
                to="/trabajos"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition group"
              >
                VER TRABAJO
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Columna Derecha - Imagen/Ilustración del proyecto */}
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <Briefcase
                    size={64}
                    className="text-amber-600 mx-auto mb-4"
                  />
                  <p className="text-2xl font-bold text-gray-800">LTD</p>
                  <p className="text-gray-600">Lucky Tiger Digital</p>
                </div>
              </div>
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-200 rounded-full opacity-50"></div>
            </div>
          </div>

          {/* Ver portafolio completo */}
          <div className="text-center mt-16">
            <Link
              to="/portafolio"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition group"
            >
              Ver nuestro portafolio
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          TESTIMONIOS SECTION
          ========================================== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Lo que dicen <span className="font-bold">nuestros clientes</span>
            </h2>
            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-4"></div>
          </div>

          {/* Testimonio Principal */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                "Mi sitio web fue construido desde cero, completamente a medida.
                La velocidad con la que creció mi negocio requirió muchas
                características y cambios en poco tiempo, asegurando que la
                calidad y la experiencia del usuario no se vieran
                comprometidas."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  TW
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Tessa White</p>
                  <p className="text-sm text-gray-500">
                    Fundadora · Down That Little Lane
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/trabajos"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition group"
                >
                  VER TRABAJOS
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Logos de Clientes */}
          <div className="border-t border-b border-gray-200 py-12">
            <p className="text-center text-sm text-gray-400 uppercase tracking-widest mb-8">
              Marcas que confían en nosotros
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              <div className="text-2xl font-bold text-gray-300 tracking-wider">
                the <span className="text-gray-400">MOODY</span> CHEF
              </div>
              <div className="text-2xl font-bold text-gray-400 tracking-wider">
                GREW & CO
              </div>
              <div className="text-2xl font-bold text-gray-300 tracking-wider">
                Burly's
              </div>
              <div className="text-2xl font-bold text-gray-400 tracking-wider">
                KORE
              </div>
            </div>
          </div>

          {/* Testimonio Secundario */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-700 text-sm italic mb-4">
                "KORE transformó completamente nuestra presencia digital. El
                equipo entendió nuestras necesidades y superó todas nuestras
                expectativas."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  JM
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    Juan Martínez
                  </p>
                  <p className="text-xs text-gray-500">CEO · TechSolutions</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-700 text-sm italic mb-4">
                "La página de electricidad que nos desarrollaron es increíble.
                Ahora podemos gestionar todo el edificio de manera eficiente y
                profesional."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  MP
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    María Pérez
                  </p>
                  <p className="text-xs text-gray-500">
                    Administradora · Edificio Central
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            ¿Listo para <span className="font-bold">crecer</span> tu negocio?
          </h2>
          <p className="text-gray-400 mb-8">
            Hablemos de cómo podemos ayudarte a alcanzar tus objetivos
            digitales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contacto"
              className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition"
            >
              CONTÁCTANOS
            </Link>
            <Link
              to="/electricidad"
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Zap size={18} />
              Gestión Electricidad
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

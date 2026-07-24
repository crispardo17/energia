import { Link } from "react-router-dom";
import {
  Zap,
  Globe,
  Smartphone,
  Award,
  Users,
  Rocket,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap size={16} />
                Agencia Digital
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Impulsamos tu
                <span className="text-blue-600"> negocio</span> al siguiente
                nivel
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Creamos experiencias digitales que conectan marcas con personas.
                Diseño, desarrollo y estrategia para hacer crecer tu empresa.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contacto"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Comenzar proyecto <ArrowRight size={20} />
                </Link>
                <Link
                  to="/electricidad"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
                >
                  Ver electricidad <Zap size={20} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Zap className="mx-auto mb-2" size={32} />
                    <p className="text-2xl font-bold">+150</p>
                    <p className="text-sm opacity-80">Proyectos</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Users className="mx-auto mb-2" size={32} />
                    <p className="text-2xl font-bold">+50</p>
                    <p className="text-sm opacity-80">Clientes</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Award className="mx-auto mb-2" size={32} />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm opacity-80">Premios</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Rocket className="mx-auto mb-2" size={32} />
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm opacity-80">Años</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que <span className="text-blue-600">hacemos</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluciones integrales para tu negocio digital
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Diseño Web</h3>
              <p className="text-gray-600">
                Creamos sitios web modernos, rápidos y optimizados para
                convertir visitantes en clientes.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Apps Móviles</h3>
              <p className="text-gray-600">
                Desarrollamos aplicaciones nativas y multiplataforma con
                experiencias de usuario excepcionales.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Marketing Digital</h3>
              <p className="text-gray-600">
                Estrategias de crecimiento, SEO y publicidad para posicionar tu
                marca en el mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Hablemos de cómo podemos ayudarte a alcanzar tus objetivos
            digitales.
          </p>
          <Link
            to="/contacto"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-flex items-center gap-2 font-semibold shadow-lg"
          >
            Contáctanos <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

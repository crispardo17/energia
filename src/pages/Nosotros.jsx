import { Link } from "react-router-dom";
import {
  Zap,
  Heart,
  Shield,
  Lightbulb,
  Award,
  Users,
  Eye,
  Target,
  Star,
  ArrowRight,
  Quote,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Nosotros() {
  const valores = [
    {
      titulo: "Crear significado, no marketing",
      descripcion:
        "Creemos que el marketing no es el fin, sino el medio para un fin. Nuestra misión es ayudar a nuestros clientes a entender a sus clientes y ofrecerles valor. Creemos que el marketing no es un evento único, sino un proceso continuo que requiere esfuerzo e innovación constantes.",
      icono: Heart,
    },
    {
      titulo: "Mantenerlo real",
      descripcion:
        "Estamos comprometidos a ofrecer un trabajo de alta calidad que sea fiel a la vida. Creemos que nuestros clientes merecen nada menos que lo mejor, y nos esforzamos por ofrecer el más alto nivel de servicio y calidad.",
      icono: Shield,
    },
    {
      titulo: "Confianza",
      descripcion:
        "Estamos comprometidos a construir relaciones a largo plazo con nuestros clientes. Creemos que la confianza es la base de cualquier asociación exitosa, y estamos dedicados a ganar y mantener su confianza.",
      icono: Shield,
    },
    {
      titulo: "Innovación",
      descripcion:
        "Estamos innovando constantemente y superando los límites de lo posible. Creemos que la innovación es la clave para mantenerse por delante de la competencia y ofrecer resultados excepcionales.",
      icono: Lightbulb,
    },
    {
      titulo: "Excelencia",
      descripcion:
        "Estamos comprometidos a ofrecer excelencia en todo lo que hacemos. Creemos que la excelencia es el sello distintivo de un negocio exitoso, y nos esforzamos por superar las expectativas de nuestros clientes.",
      icono: Award,
    },
    {
      titulo: "Integridad",
      descripcion:
        "Estamos comprometidos a mantener los más altos estándares de integridad y ética. Creemos que la integridad es la base de un negocio exitoso, y nos esforzamos por construir una reputación de honestidad y transparencia.",
      icono: Shield,
    },
    {
      titulo: "Pasión",
      descripcion:
        "Somos apasionados por lo que hacemos y por el trabajo que realizamos. Creemos que la pasión es el combustible que nos impulsa a lograr grandes cosas, y nos esforzamos por inspirar y motivar a nuestros clientes y miembros del equipo.",
      icono: Heart,
    },
    {
      titulo: "Equipo",
      descripcion:
        "Estamos orgullosos de trabajar con un equipo de profesionales talentosos y dedicados. Creemos que un equipo fuerte es la base de un negocio exitoso, y nos esforzamos por construir un equipo cohesivo, comprometido y apasionado por lo que hace.",
      icono: Users,
    },
    {
      titulo: "Visión",
      descripcion:
        "Tenemos una visión clara para el futuro de nuestro negocio. Creemos que una visión clara es esencial para el éxito, y nos esforzamos por crear una visión que sea inspiradora y alcanzable.",
      icono: Eye,
    },
  ];

  const testimonios = [
    {
      nombre: "Richard Sheppard",
      cargo: "Director General",
      empresa: "Sky5",
      logo: "SKY5",
      texto:
        "Originalmente macdaddy, ahora Kore, brindó soporte a National Height Safety & Access Solutions durante más de 10 años. Habiéndose fusionado y ahora llamado Sky5, Kore sigue con nosotros porque siempre han superado nuestras expectativas. Kore ha estado a la vanguardia de nuestros sitios web y branding, y sus esfuerzos han aumentado notablemente el conocimiento del mercado e impactado positivamente en nuestra rentabilidad. No tengo dudas en recomendar a Kore, y lo he hecho en varias ocasiones.",
      iniciales: "RS",
    },
    {
      nombre: "Gary Daly",
      cargo: "Gerente Nacional de TI",
      empresa: "Surf Life Saving Australia",
      logo: "SLSA",
      texto:
        "Originalmente macdaddy, ahora KORE, ha sido nuestro principal equipo de soluciones de Internet durante los últimos tres años. Durante este tiempo, han proporcionado un servicio completo de proyecto y entrega a Surf Life Saving Australia, incluyendo diseño de soluciones, gestión de proyectos, construcción de sitios web, sitios web optimizados para smartphones, aplicación para iPhone, alojamiento de sitios, mejoras, alojamiento DNS y soluciones de bases de datos. Estamos muy satisfechos con el servicio completo que macdaddy proporciona, incluyendo la relación costo-servicio que se ha logrado con nuestra asociación mutua. Hemos encontrado que macdaddy es receptivo e innovador en las soluciones propuestas, además de útil para proporcionar servicios de valor agregado que hemos necesitado, a veces con poca antelación. En términos del conjunto de sitios web y aplicaciones para iPhone de beachsafe, macdaddy ha ayudado a SLSA a lograr reconocimiento nacional, incluyendo un premio Australian Safer Community 2011, proyecto altamente recomendado para proyectos de importancia nacional.",
      iniciales: "GD",
    },
    {
      nombre: "Andre Slade",
      cargo: "Propietario",
      empresa: "OceanFit",
      logo: "OCEANFIT",
      texto:
        "He sido cliente de Macdaddy/Kore durante muchos años, primero en mi rol como Gerente Nacional de Salvavidas para el Servicio Australiano de Salvavidas (ALS) y luego como cliente para mi propio negocio OceanFit. Me impresionó su trabajo de diseño y su preocupación por la usabilidad, tanto que les encargué construir el sitio web de mi propio negocio personal. Estoy extremadamente satisfecho con los resultados y recibo constantemente comentarios positivos de los usuarios del sitio.",
      iniciales: "AS",
    },
  ];

  const logosClientes = [
    { nombre: "Sky5", color: "bg-blue-100", textColor: "text-blue-600" },
    {
      nombre: "Surf Life Saving",
      color: "bg-red-100",
      textColor: "text-red-600",
    },
    { nombre: "OceanFit", color: "bg-cyan-100", textColor: "text-cyan-600" },
    {
      nombre: "National Height Safety",
      color: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      nombre: "Australian Lifeguard",
      color: "bg-green-100",
      textColor: "text-green-600",
    },
  ];

  const getColorClasses = (index) => {
    const colors = [
      {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        icon: "bg-blue-100",
      },
      {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        icon: "bg-purple-100",
      },
      {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        icon: "bg-green-100",
      },
      {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        icon: "bg-orange-100",
      },
      {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        icon: "bg-red-100",
      },
      {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        icon: "bg-indigo-100",
      },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold tracking-widest px-4 py-2 mb-6 rounded-full uppercase">
            Sobre nosotros
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
            Nos guía un fuerte sentido de
            <br />
            <span className="font-bold text-blue-600">
              pasión por el diseño
            </span>
            <br />
            <span className="font-bold">y la web</span>
          </h1>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Creemos en construir relaciones auténticas y ofrecer valor real a
            través de la innovación y la excelencia.
          </p>
          <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-8"></div>
        </div>
      </section>

      {/* ==========================================
          FILOSOFÍA / VALORES GRID
          ========================================== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Nuestros <span className="font-bold">Valores</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Estos son los principios que guían cada decisión y cada proyecto
              que emprendemos.
            </p>
            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="space-y-8">
            {valores.map((valor, index) => {
              const colors = getColorClasses(index);
              const Icon = valor.icono;

              return (
                <div
                  key={index}
                  className={`${colors.bg} border ${colors.border} rounded-3xl p-8 transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`${colors.icon} p-3 rounded-xl flex-shrink-0`}
                    >
                      <Icon className={`${colors.text}`} size={28} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                        {valor.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {valor.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          MISIÓN, VISIÓN Y VALORES
          ========================================== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Misión</h3>
              <p className="text-gray-600 text-sm">
                Ayudar a nuestros clientes a entender a sus clientes y
                ofrecerles valor real a través de soluciones digitales
                innovadoras.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visión</h3>
              <p className="text-gray-600 text-sm">
                Ser la agencia digital líder en la creación de experiencias que
                conectan marcas con personas de manera auténtica y
                significativa.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Valores</h3>
              <p className="text-gray-600 text-sm">
                Honestidad, integridad, excelencia, innovación y pasión. Estos
                son los pilares que definen nuestra cultura y nuestro trabajo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          LOGOS DE CLIENTES
          ========================================== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-400 uppercase tracking-widest">
              Empresas que confían en nosotros
            </p>
            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {logosClientes.map((logo, index) => (
              <div
                key={index}
                className={`${logo.color} rounded-2xl p-6 flex items-center justify-center min-h-[80px] transition-all duration-300 hover:scale-105 hover:shadow-md`}
              >
                <span
                  className={`text-xl font-bold ${logo.textColor} tracking-wider text-center`}
                >
                  {logo.nombre}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          TESTIMONIOS SECTION
          ========================================== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Quote className="text-blue-600" size={48} />
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Lo que dicen <span className="font-bold">nuestros clientes</span>
            </h2>
            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="space-y-12">
            {testimonios.map((testimonio, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm"
              >
                {/* Logo del cliente dentro del testimonio */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">
                      {testimonio.logo}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {testimonio.empresa}
                  </span>
                </div>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                  "{testimonio.texto}"
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonio.nombre}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonio.cargo} · {testimonio.empresa}
                    </p>
                  </div>
                  <Link
                    to="/trabajos"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition group text-sm"
                  >
                    VER TRABAJO
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION
          ========================================== */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            ¿Compartes nuestra <span className="font-bold">filosofía</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Trabajemos juntos para crear algo increíble. Contáctanos y hablemos
            de tu proyecto.
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

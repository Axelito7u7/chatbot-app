import { useState } from "react";
import { Link } from 'react-router-dom';
import Header from '../componentes/header'

const expertiseAreas = [
  {
    title: "Fundamentos del Emprendimiento Sostenible",
    image: "/imagenes/sustainable-entrepreneurship.jpg"
  },
  {
    title: "Globalización y Negocios Internacionales",
    image: "/imagenes/global-business.jpg"
  },
  {
    title: "Formación y Gestión de Equipos de Alto Rendimiento",
    image: "/imagenes/team-management.jpg"
  },
  {
    title: "Aspectos Legales y Éticos Internacionales",
    image: "/imagenes/legal-ethics.jpg"
  },
  {
    title: "Finanzas y Administración para la Expansión Internacional",
    image: "/imagenes/international-finance.jpg"
  },
  {
    title: "Negociación y Resolución de Conflictos",
    image: "/imagenes/conflict-resolution.jpg"
  }
];

const advantages = [
  {
    title: "Flexibilidad de Aprendizaje",
    description: "Estudia a tu propio ritmo con nuestro programa en línea."
  },
  {
    title: "Profesores Expertos",
    description: "Aprende de líderes en la industria digital y de negocios."
  },
  {
    title: "Proyectos Prácticos",
    description: "Aplica tus conocimientos en casos reales del mundo empresarial."
  },
  {
    title: "Networking Global",
    description: "Conecta con profesionales y expertos de todo el mundo."
  }
];

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
          <img
            src="/imagenes/banner.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Maestría en Negocios Digitales</h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md max-w-2xl">¡CONVIÉRTETE EN UN EXPERTO EN EL MUNDO DIGITAL!</p>
            <Link to="/saber-mas" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors text-sm sm:text-base">
              SABER MÁS
            </Link>
          </div>
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 border-2 border-white rounded-full opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-32 sm:h-32 border-2 border-white rounded-full opacity-30"></div>
        </section>

        <section className="bg-blue-600 text-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video">
                <img
                  src="/imagenes/digital-business-meeting.jpg"
                  alt="Digital Business Meeting"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-transparent opacity-70 rounded-lg"></div>
                <div className="absolute top-4 left-4 right-4 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">MAESTRÍA EN NEGOCIOS DIGITALES</h2>
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">Nuestras Ventajas</h2>
                <div className="space-y-4">
                  {advantages.map((advantage, index) => (
                    <div key={index} className="bg-blue-700 rounded-lg p-4 sm:p-6 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{advantage.title}</h3>
                      <p className="text-blue-100 text-sm sm:text-base">{advantage.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Conoce nuestra oferta educativa</h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  En la era de la transformación digital, la Maestría en Negocios Digitales se presenta como una oportunidad única para adquirir las habilidades y conocimientos necesarios para liderar en el dinámico mundo empresarial actual. Este programa está diseñado para profesionales que buscan estar a la vanguardia de las tecnologías emergentes y las estrategias digitales.
                </p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Nuestra maestría ofrece una combinación de teoría y práctica, brindando una comprensión profunda de la gestión de proyectos digitales, el marketing digital, la analítica de datos y la innovación tecnológica. A través de un plan de estudios actualizado y relevante, los estudiantes aprenderán a desarrollar e implementar estrategias digitales efectivas, gestionar equipos y proyectos, y utilizar herramientas analíticas para tomar decisiones informadas.
                </p>
              </div>
              <div className="relative aspect-video">
                <img
                  src="/imagenes/digital-business-future.jpg"
                  alt="Master your future in Digital Business"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-blue-900 opacity-20 rounded-lg"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">MASTER'S</h3>
                  <h4 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">BUSINESS</h4>
                  <p className="text-xl sm:text-2xl font-semibold">MASTER YOUR FUTURE</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section className="py-16 bg-[#4285f4]">
    <div className="container max-w-screen-lg mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        DOMINA Y CONVIÉRTETE EN UN EXPERTO EN:
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {expertiseAreas.map((area, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={area.image}
              alt={area.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {area.title}
              </h3>
              <Link
                href={area.link}
                className={`inline-flex items-center justify-center px-4 py-1 bg-[#4285f4] text-white rounded-full font-medium transition-all duration-300 transform ${
                  hoveredIndex === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                Saber más
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>


      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p>&copy; {new Date().getFullYear()} Maestría en Negocios Digitales. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
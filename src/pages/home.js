import { Link } from 'react-router-dom'; // Importa Link de react-router-dom

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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-0">MAESTRÍA EN NEGOCIOS DIGITALES</h1>
        <nav className="w-full sm:w-auto">
          <ul className="flex flex-wrap justify-center sm:space-x-6">
            {['Inicio', 'Acerca', 'Contacto', 'Newsletter', 'Blog', 'CRM'].map((item) => (
              <li key={item} className="mx-2 my-1 sm:mx-0 sm:my-0">
                <Link to={item === 'CRM' ? '/crm' : `/${item.toLowerCase()}`} className="text-gray-600 hover:text-gray-800 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/imagenes/banner.jpg"
            alt="Digital Business Background"
            className="w-full h-full object-cover brightness-50"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 py-12 sm:py-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Maestría en Negocios Digitales</h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md">¡CONVIÉRTETE EN UN EXPERTO EN EL MUNDO DIGITAL!</p>
          <Link to="/saber-mas" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors text-sm sm:text-base">
            SABER MÁS
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 border-2 border-white rounded-full opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-32 sm:h-32 border-2 border-white rounded-full opacity-30"></div>
      </main>

      {/* Advantages Section */}
      <section className="bg-blue-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <img
                src="/imagenes/digital-business-meeting.jpg"
                alt="Digital Business Meeting"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-900 to-transparent h-24 rounded-t-lg"></div>
              <div className="absolute top-4 left-4 right-4 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">MAESTRÍA EN NEGOCIOS DIGITALES</h2>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-12 mt-8 lg:mt-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center lg:text-left">Nuestras Ventajas</h2>
            <div className="space-y-4 sm:space-y-6">
              {[ /* Ventajas aquí */ ].map((advantage, index) => (
                <div key={index} className="bg-blue-700 rounded-lg p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-blue-100 text-sm sm:text-base">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Educational Offer Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center lg:text-left">Conoce nuestra oferta educativa</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                En la era de la transformación digital, la Maestría en Negocios Digitales se presenta como una oportunidad única para adquirir las habilidades y conocimientos necesarios para liderar en el dinámico mundo empresarial actual. Este programa está diseñado para profesionales que buscan estar a la vanguardia de las tecnologías emergentes y las estrategias digitales.
              </p>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Nuestra maestría ofrece una combinación de teoría y práctica, brindando una comprensión profunda de la gestión de proyectos digitales, el marketing digital, la analítica de datos y la innovación tecnológica. A través de un plan de estudios actualizado y relevante, los estudiantes aprenderán a desarrollar e implementar estrategias digitales efectivas, gestionar equipos y proyectos, y utilizar herramientas analíticas para tomar decisiones informadas.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
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
        </div>
      </section>

      {/* Expertise Areas Section */}
      <section className="py-12 sm:py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-white">
            DOMINA Y CONVIÉRTETE EN UN EXPERTO EN:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="bg-blue-700 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <img src={area.image} alt={area.title} className="w-full h-32 object-cover rounded-md mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white">{area.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center text-white">
          <p>&copy; 2024 Maestría en Negocios Digitales. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

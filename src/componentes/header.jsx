import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Search, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-8">MAESTRÍA EN NEGOCIOS DIGITALES</h1>
              <nav className="hidden md:block">
                <ul className="flex space-x-4">
                  {['Inicio', 'Acerca', 'Contacto', 'Newsletter', 'Blog', 'CRM'].map((item) => (
                    <li key={item}>
                      <Link 
                        to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} 
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          {isMenuOpen && (
            <nav className="md:hidden mt-4">
              <ul className="flex flex-col space-y-2">
                {['Inicio', 'Acerca', 'Contacto', 'Newsletter', 'Blog', 'CRM'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} 
                      className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
  );
}
